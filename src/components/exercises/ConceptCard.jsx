import { useState } from 'react';

const ConceptCard = ({ exercise, onContinue }) => {
    const content = exercise.content;

    // Highlight text within the content
    const highlightText = (text, highlight, isCode) => {
        if (!highlight) return text;

        const parts = text.split(new RegExp(`(${highlight})`, 'gi'));
        return parts.map((part, i) =>
            part.toLowerCase() === highlight.toLowerCase() ? (
                <span key={i} className={isCode ? 'concept-code' : 'concept-highlight'}>
                    {part}
                </span>
            ) : part
        );
    };

    const getIllustration = (imageName) => {
        const illustrations = {
            'network-basic': '🌐',
            'home-network': '🏠',
            'internet': '🌍',
            'router': '📡',
            'switch': '🔀',
            'end-devices': '💻',
            'ip-address': '🏠',
            'ip-format': '🔢',
            'ip-range': '📊',
            'cli': '⌨️',
            'prompt': '➤',
            'cli-power': '⚡',
            'user-mode': '👤',
            'priv-mode': '🔐',
            'enable': '🔓',
            'practice': '🎯',
            'config-mode': '🔧',
            'conf-t': '⚙️',
            'config-prompt': '📝',
            'hostname': '🏷️',
            'hostname-cmd': '✏️',
            'interfaces': '🔌',
            'interface-names': '📋',
            'short-names': '📝',
            'interface-config': '⚙️',
            'lab': '🧪',
            'ip-assign': '📍',
            'ip-cmd': '💻',
            'ip-example': '📝',
            'subnet': '🔢',
            'shutdown': '🔴',
            'no-shutdown': '🟢',
            'celebration': '🎉',
        };
        return illustrations[imageName] || '📚';
    };

    return (
        <div className="flex flex-col h-full">
            {/* Content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
                <div className="concept-card max-w-md w-full animate-bounce-in">
                    {/* Illustration */}
                    <div className="text-7xl mb-6">
                        {getIllustration(content.image)}
                    </div>

                    {/* Title */}
                    <h2 className="text-2xl font-bold mb-4" style={{ color: '#3C3C3C' }}>
                        {content.title}
                    </h2>

                    {/* Text */}
                    <p className="text-lg leading-relaxed" style={{ color: '#777777' }}>
                        {highlightText(content.text, content.highlight, content.code)}
                    </p>

                    {/* Code example if present */}
                    {content.code && typeof content.code === 'string' && (
                        <div className="mt-4 p-3 rounded-xl font-mono text-lg" style={{ backgroundColor: '#f0f0f0' }}>
                            {content.code}
                        </div>
                    )}
                </div>
            </div>

            {/* Continue button */}
            <div className="p-6 border-t" style={{ borderColor: '#E5E5E5' }}>
                <button
                    onClick={() => onContinue(true)}
                    className="btn-check"
                >
                    CONTINUE
                </button>
            </div>
        </div>
    );
};

export default ConceptCard;
