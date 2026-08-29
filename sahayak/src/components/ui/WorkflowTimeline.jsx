import React from 'react';
import { CheckCircle2, Circle, Clock } from 'lucide-react';

export default function WorkflowTimeline({ steps }) {
  return (
    <div className="relative">
      {steps.map((step, idx) => {
        const isLast = idx === steps.length - 1;
        const isDone = step.status === 'done';
        const isActive = step.status === 'active';
        const isPending = step.status === 'pending';

        return (
          <div key={idx} className="flex gap-4">
            {/* Icon + line */}
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10 ${
                isDone
                  ? 'bg-green-100'
                  : isActive
                  ? 'bg-brand-100 ring-2 ring-brand-300'
                  : 'bg-gray-50'
              }`}>
                {isDone
                  ? <CheckCircle2 className="w-4 h-4 text-green-600" />
                  : isActive
                  ? <Clock className="w-4 h-4 text-brand-600" />
                  : <Circle className="w-4 h-4 text-gray-300" />
                }
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 my-1 ${isDone ? 'bg-green-200' : 'bg-gray-100'}`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-5 ${isLast ? '' : ''}`}>
              <p className={`text-sm font-medium ${
                isDone ? 'text-gray-900'
                : isActive ? 'text-brand-700'
                : 'text-gray-400'
              }`}>
                {step.step}
              </p>
              {step.timestamp && (
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(step.timestamp).toLocaleDateString('en-IN', {
                    day: 'numeric', month: 'short', year: 'numeric',
                    hour: '2-digit', minute: '2-digit'
                  })}
                </p>
              )}
              {step.actor && (
                <p className="text-xs text-gray-500 mt-0.5">{step.actor}</p>
              )}
              {isActive && (
                <span className="inline-block mt-1 text-xs bg-brand-50 text-brand-700 px-2 py-0.5 rounded-full font-medium">
                  In Progress
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
