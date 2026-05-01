import express from "express";
import { createServer as createHttpServer } from "http";
import { Server } from "socket.io";
import { createServer as createViteServer } from "vite";
import path from "path";
import { checkAndSendReminders, sendNotification, addMockBooking, updateMockBooking, sendReminder, sendVerificationStatusEmail } from './src/services/reminderService.ts';
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import Stripe from 'stripe';

const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' as any }) 
  : null;

async function startServer() {
  const app = express();

  const httpServer = createHttpServer(app);
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  const PORT = 3000;

  // Socket.io handlers
  io.on("connection", (socket) => {
    socket.on("disconnect", () => {
    });
  });

  // API routes
  app.use(express.json());

  // Diagnostic route
  app.get("/api/test", (req, res) => {
    res.json({ message: "API is working", dbConnected: false, timestamp: new Date().toISOString() });
  });

  app.post("/api/notifications", async (req, res) => {
    try {
      const { booking, type } = req.body;
      if (!booking || !type) {
        return res.status(400).json({ error: "Missing booking or type" });
      }
      
      if (type === 'new') {
        addMockBooking(booking);
      } else if (type === 'cancel' || type === 'reschedule') {
        updateMockBooking(booking, type);
      }

      await sendNotification(booking, type);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending notification:", error);
      res.status(500).json({ error: "Failed to send notification" });
    }
  });

  app.post("/api/reminders", async (req, res) => {
    try {
      const { booking, type, method } = req.body;
      if (!booking || !type) {
        return res.status(400).json({ error: "Missing booking or type" });
      }
      
      await sendReminder(booking, type, method || 'both');
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending reminder:", error);
      res.status(500).json({ error: "Failed to send reminder" });
    }
  });

  app.post("/api/admin/verify-notify", async (req, res) => {
    try {
      const { email, status } = req.body;
      if (!email || !status) {
        return res.status(400).json({ error: "Missing email or status" });
      }
      
      await sendVerificationStatusEmail(email, status);
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error sending verification email:", error);
      res.status(500).json({ error: "Failed to send verification email" });
    }
  });

  app.post("/api/create-checkout-session", async (req, res) => {
    try {
      const { bookingData } = req.body;
      if (!bookingData) {
        return res.status(400).json({ error: "Missing booking data" });
      }

      const baseAmount = bookingData.amount;
      const customerFee = baseAmount * 0.08;
      const practitionerFee = baseAmount * 0.08;
      
      const totalCustomerCharge = baseAmount + customerFee;
      const totalPlatformFee = customerFee + practitionerFee;

      if (stripe) {
        const sessionConfig: any = {
          line_items: [
            {
              price_data: {
                currency: bookingData.currency.toLowerCase(),
                product_data: {
                  name: `Cupping Session with ${bookingData.practitionerName}`,
                  description: `${bookingData.date} at ${bookingData.time}`,
                },
                unit_amount: Math.round(totalCustomerCharge * 100),
              },
              quantity: 1,
            },
          ],
          mode: 'payment',
          automatic_payment_methods: {
            enabled: true,
          },
          success_url: `${process.env.APP_URL || 'http://localhost:3000'}/?session_id={CHECKOUT_SESSION_ID}&status=success`,
          cancel_url: `${process.env.APP_URL || 'http://localhost:3000'}/?status=cancelled`,
        };

        if (bookingData.practitionerStripeAccountId) {
          sessionConfig.payment_intent_data = {
            application_fee_amount: Math.round(totalPlatformFee * 100),
            transfer_data: {
              destination: bookingData.practitionerStripeAccountId,
            },
          };
        }

        const session = await stripe.checkout.sessions.create(sessionConfig);

        res.json({ url: session.url });
      } else {
        res.json({ mock: true, totalCustomerCharge, totalPlatformFee });
      }
    } catch (error) {
      console.error("Error creating checkout session:", error);
      res.status(500).json({ error: "Failed to create checkout session" });
    }
  });

  app.post("/api/create-connect-account", async (req, res) => {
    try {
      if (!stripe) {
        return res.status(400).json({ error: "Stripe is not configured" });
      }

      const account = await stripe.accounts.create({
        type: 'express',
        capabilities: {
          transfers: { requested: true },
        },
      });

      const accountLink = await stripe.accountLinks.create({
        account: account.id,
        refresh_url: `${process.env.APP_URL || 'http://localhost:3000'}/?view=dashboard`,
        return_url: `${process.env.APP_URL || 'http://localhost:3000'}/?view=dashboard&stripe_onboarded=true`,
        type: 'account_onboarding',
      });

      res.json({ url: accountLink.url, accountId: account.id });
    } catch (error) {
      console.error("Error creating Connect account:", error);
      res.status(500).json({ error: "Failed to create Connect account" });
    }
  });

  app.get("/api/admin/balance", async (req, res) => {
    try {
      if (!stripe) {
        return res.json({
          available: [{ amount: 125000, currency: 'usd' }],
          pending: [{ amount: 45000, currency: 'usd' }]
        });
      }
      const balance = await stripe.balance.retrieve();
      res.json(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      res.status(500).json({ error: "Failed to fetch balance" });
    }
  });

  app.post("/api/admin/payout", async (req, res) => {
    try {
      const { amount, currency } = req.body;
      
      if (!stripe) {
        return res.json({ success: true, mock: true, amount, currency });
      }
      
      const payout = await stripe.payouts.create({
        amount: amount,
        currency: currency || 'usd',
      });
      
      res.json({ success: true, payout });
    } catch (error: any) {
      console.error("Error creating payout:", error);
      res.status(500).json({ error: error.message || "Failed to create payout" });
    }
  });

  app.get("/api/admin/stripe-status", async (req, res) => {
    try {
      res.json({
        configured: !!stripe,
        mode: !!stripe ? 'live/test' : 'mock',
        publishableKeySet: !!process.env.VITE_STRIPE_PUBLISHABLE_KEY
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check stripe status" });
    }
  });
  
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error("Unhandled Server Error:", err);
    res.status(500).json({ error: "Internal Server Error", message: err.message });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
