/**
 * History Page Component
 * Interactive collaborative story with distinct author styling
 * Supports form submission to Telegram via Cloudflare Worker
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Translations, Lang } from '../../translations/translations';
import { STORY_CHAPTERS } from '../../translations/story';
import Card from '../ui/Card';
import { ANALYTICS_URL } from '../../config';

interface HistoryProps {
    /** Translation strings */
    t: Translations;
    /** Current language */
    lang: Lang;
}

export default function History({ t, lang }: HistoryProps) {
    const [inputText, setInputText] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [submitError, setSubmitError] = useState(false);

    // Load draft from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('history-draft');
        if (saved) setInputText(saved);
    }, []);

    // Save draft to localStorage
    useEffect(() => {
        if (inputText) {
            localStorage.setItem('history-draft', inputText);
        }
    }, [inputText]);

    const lastChapter = STORY_CHAPTERS[STORY_CHAPTERS.length - 1];
    const hasPrompt = lastChapter?.prompt && lastChapter.author === 'ilya';
    const currentPrompt = lastChapter?.prompt?.[lang];

    const handleSubmit = async () => {
        if (!inputText.trim() || isSubmitting) return;

        setIsSubmitting(true);
        setSubmitError(false);

        try {
            const response = await fetch(ANALYTICS_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'story_submission',
                    chapterId: lastChapter.id + 1,
                    text: inputText.trim(),
                    timestamp: new Date().toISOString(),
                }),
            });

            if (response.ok) {
                setSubmitSuccess(true);
                localStorage.removeItem('history-draft');
                setInputText('');
            } else {
                setSubmitError(true);
            }
        } catch {
            setSubmitError(true);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-4">
            <Card className="p-5">
                <h2 className="mb-2 text-xl font-semibold text-[var(--ink)]">
                    {t.historyTitle}
                </h2>
                <p className="text-[var(--ink)]/90">{t.historyCopy}</p>
            </Card>

            {/* Story Container */}
            <Card className="history-book p-6 overflow-hidden">
                <div className="space-y-6">
                    {STORY_CHAPTERS.map((chapter, index) => (
                        <motion.div
                            key={chapter.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.2 }}
                            className={`story-chapter ${chapter.author === 'ilya' ? 'story-ilya' : 'story-camila'}`}
                        >
                            <div className="story-author-label">
                                {chapter.author === 'ilya' ? '✒️ Илья' : '🌸 Камила'}
                            </div>
                            <div className="story-text whitespace-pre-line">
                                {chapter.text[lang]}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Input Form */}
                <AnimatePresence mode="wait">
                    {hasPrompt && !submitSuccess && (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <div className="prompt-box">
                                <p className="prompt-text">
                                    ✨ {currentPrompt}
                                </p>
                            </div>

                            <textarea
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder={t.historyPlaceholder}
                                className="story-textarea"
                                disabled={isSubmitting}
                            />

                            <div className="flex items-center justify-between mt-4">
                                <span className="text-xs" style={{ color: '#8b6914' }}>
                                    {inputText.length} / 2000
                                </span>

                                <button
                                    onClick={handleSubmit}
                                    disabled={!inputText.trim() || isSubmitting || inputText.length > 2000}
                                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-pink-400 to-rose-400 text-white font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? t.historySending : t.historySend}
                                </button>
                            </div>

                            {submitError && (
                                <p className="mt-2 text-center text-red-500 text-sm">
                                    {t.historyError}
                                </p>
                            )}
                        </motion.div>
                    )}

                    {submitSuccess && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="success-box"
                        >
                            <div className="text-5xl mb-4">💌</div>
                            <p className="success-title">
                                {t.historySuccess}
                            </p>
                            <p className="success-hint">
                                {t.historySuccessHint}
                            </p>
                        </motion.div>
                    )}
                </AnimatePresence>
            </Card>
        </div >
    );
}
