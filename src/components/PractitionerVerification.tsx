import React from 'react';
import { PractitionerProfile } from '../types';
import { Check, X, Shield, FileText } from 'lucide-react';
import Markdown from 'react-markdown';

interface Props {
  practitioners: PractitionerProfile[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export const PractitionerVerification: React.FC<Props> = ({ practitioners, onApprove, onReject }) => {
  const pendingPractitioners = practitioners.filter(p => p.verificationStatus === 'pending');

  return (
    <div className="w-full">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-blue-900 flex items-center gap-3">
          <Shield className="w-6 h-6 text-blue-600" />
          Pending Verifications
        </h2>
        <p className="text-gray-600 mt-2">Review and approve pending practitioner registrations.</p>
      </div>

      {pendingPractitioners.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-blue-100 shadow-sm">
          <Shield className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-gray-500">No pending verifications</h3>
          <p className="text-gray-400 mt-2">All practitioner applications have been reviewed.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pendingPractitioners.map(practitioner => (
            <div key={practitioner.uid} className="bg-white rounded-3xl p-6 border border-blue-100 shadow-sm flex flex-col">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-blue-900">{practitioner.displayName}</h3>
                  <p className="text-sm text-gray-500">{practitioner.email}</p>
                </div>
                <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Pending
                </span>
              </div>

              <div className="space-y-3 mb-6 flex-1">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Location</p>
                  <p className="text-sm text-gray-800">{practitioner.location.address}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Specialties</p>
                  <div className="flex flex-wrap gap-1">
                    {practitioner.specialties.map(spec => (
                      <span key={spec} className="text-[10px] bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium">
                        {spec}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold tracking-wider mb-1">Bio</p>
                  <div className="text-sm text-gray-700 line-clamp-3 markdown-body">
                    <Markdown>{practitioner.bio}</Markdown>
                  </div>
                </div>
                {practitioner.credentialsUrl && (
                  <div className="mb-4">
                    <a 
                      href={practitioner.credentialsUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 font-bold transition-all border border-blue-100"
                    >
                      <FileText className="w-5 h-5" />
                      View Credentials
                    </a>
                  </div>
                )}
              </div>

              <div className="flex gap-3 mt-auto pt-4 border-t border-gray-100">
                <button
                  onClick={() => onReject(practitioner.uid)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-red-600 font-bold transition-all border border-transparent hover:border-red-100 cursor-pointer active:scale-95 transform shadow-sm hover:shadow-md"
                  title="Reject Application"
                >
                  <X className="w-5 h-5" />
                  Reject
                </button>
                <button
                  onClick={() => onApprove(practitioner.uid)}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 font-bold transition-all shadow-lg shadow-blue-200 cursor-pointer active:scale-95 transform hover:shadow-xl"
                  title="Approve Application"
                >
                  <Check className="w-5 h-5" />
                  Approve
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
