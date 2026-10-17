import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowUpRight,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  Share2,
  Check,
  Copy,
  ChevronDown,
  Mail
} from 'lucide-react';
import { BLOG_POSTS } from '../data/blogData';

function SocialShareDropdown({ post, isDark }) {
  const [isOpen, setIsOpen] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mobileCoords, setMobileCoords] = useState(null);
  const triggerRef = useRef(null);
  const popupRef = useRef(null);

  const getShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.origin + window.location.pathname + '#/blog/' + post.slug;
    }
    return 'https://searchandservice.pages.dev/#/blog/' + post.slug;
  };

  const updateMobilePosition = () => {
    if (!triggerRef.current) return;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const rect = triggerRef.current.getBoundingClientRect();
      // Capsule width: 6 platform icons (36px each) + 5 gaps (6px each) + padding (16px) + borders
      const popupWidth = 270;
      const popupHeight = 52;
      const margin = 12; // Minimum padding from any screen edge

      // Align right edge with trigger button, clamped strictly between [margin, window.innerWidth - popupWidth - margin]
      let left = rect.right - popupWidth;
      const maxLeft = Math.max(margin, window.innerWidth - popupWidth - margin);
      left = Math.min(Math.max(margin, left), maxLeft);

      // Vertical placement: place below trigger, flip above if near bottom of viewport
      const spaceBelow = window.innerHeight - rect.bottom;
      let top;
      if (spaceBelow < popupHeight + margin && rect.top > popupHeight + margin) {
        top = Math.max(margin, rect.top - popupHeight - 8);
      } else {
        top = Math.min(window.innerHeight - popupHeight - margin, rect.bottom + 8);
      }

      setMobileCoords({ top, left });
    } else {
      setMobileCoords(null);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateMobilePosition();
    }
    setIsOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isOpen) {
      updateMobilePosition();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      const isOutsideTrigger = triggerRef.current && !triggerRef.current.contains(event.target);
      const isOutsidePopup = popupRef.current && !popupRef.current.contains(event.target);
      if (isOutsideTrigger && isOutsidePopup) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    const handleWindowChange = () => {
      if (isOpen) {
        updateMobilePosition();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside, { passive: true });
      document.addEventListener('keydown', handleKeyDown);
      window.addEventListener('resize', handleWindowChange);
      window.addEventListener('scroll', handleWindowChange, { passive: true });
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('resize', handleWindowChange);
      window.removeEventListener('scroll', handleWindowChange);
    };
  }, [isOpen]);

  const handleCopyLink = () => {
    const url = getShareUrl();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  const handleShareLinkedIn = () => {
    const url = getShareUrl();
    const shareTarget = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
    window.open(shareTarget, '_blank', 'noopener,noreferrer,width=620,height=580');
    setIsOpen(false);
  };

  const handleShareX = () => {
    const url = getShareUrl();
    const text = `${post.title} — Growth Playbook by SearchandService`;
    const shareTarget = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    window.open(shareTarget, '_blank', 'noopener,noreferrer,width=600,height=460');
    setIsOpen(false);
  };

  const handleShareFacebook = () => {
    const url = getShareUrl();
    const shareTarget = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(shareTarget, '_blank', 'noopener,noreferrer,width=620,height=520');
    setIsOpen(false);
  };

  const handleShareWhatsApp = () => {
    const url = getShareUrl();
    const text = `${post.title} - ${url}`;
    const shareTarget = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(shareTarget, '_blank', 'noopener,noreferrer');
    setIsOpen(false);
  };

  const handleShareEmail = () => {
    const url = getShareUrl();
    const subject = `Growth Playbook: ${post.title}`;
    const body = `Hi,\n\nI thought you'd find this local business growth playbook from SearchandService valuable:\n\n${post.title}\n"${post.subtitle}"\n\nRead here: ${url}\n\n`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button: Strictly circular icon button on mobile, full pill on desktop */}
      <button
        ref={triggerRef}
        onClick={handleToggle}
        aria-label="Share Playbook"
        aria-expanded={isOpen}
        className={`relative transition-all shadow-sm flex items-center justify-center border font-mono font-bold text-xs active:scale-95 ${
          // Mobile: Strictly circular icon button
          'w-10 h-10 min-w-[40px] min-h-[40px] rounded-full aspect-square p-0 flex-shrink-0'
        } ${
          // Desktop: Expanded pill button
          'md:w-auto md:h-auto md:min-w-0 md:min-h-0 md:aspect-auto md:rounded-xl md:px-4 md:py-2.5 md:gap-2.5'
        } ${
          isOpen
            ? 'bg-[#FF6B1A] text-white border-[#FF6B1A] shadow-md shadow-[#FF6B1A]/25'
            : isDark
            ? 'bg-white/[0.05] border-white/15 text-neutral-200 hover:border-[#FF6B1A] hover:text-[#FF6B1A]'
            : 'bg-black/[0.04] border-black/15 text-neutral-800 hover:border-[#FF6B1A] hover:text-[#FF6B1A]'
        }`}
      >
        <Share2 className={`w-4 h-4 flex-shrink-0 ${isOpen ? 'text-white' : 'text-[#FF6B1A]'}`} />
        <span className="hidden md:inline">Share Playbook</span>
        <ChevronDown
          className={`hidden md:inline w-3.5 h-3.5 transition-transform duration-200 ${
            isOpen ? 'rotate-180 text-white' : 'opacity-60'
          }`}
        />
      </button>

      {/* MOBILE VIEW (< md): FLOATING SCREEN-CONSTRAINED CAPSULE WITH ONLY PLATFORM ICONS */}
      {isOpen && (
        <div
          ref={popupRef}
          style={
            mobileCoords
              ? { top: `${mobileCoords.top}px`, left: `${mobileCoords.left}px` }
              : undefined
          }
          className={`md:hidden fixed z-[9999] shadow-2xl backdrop-blur-2xl border transition-all duration-200 rounded-full p-1.5 max-w-[calc(100vw-24px)] overflow-x-auto ${
            isDark
              ? 'bg-[#0D0D0D]/95 border-white/20 text-white shadow-black/90'
              : 'bg-white/95 border-black/15 text-[#0A0A0A] shadow-black/20'
          }`}
        >
          <div className="flex items-center justify-center gap-1.5 px-0.5">
            {/* LinkedIn */}
            <button
              onClick={handleShareLinkedIn}
              title="Share on LinkedIn"
              aria-label="Share on LinkedIn"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#0A66C2]/15 text-[#0A66C2] active:scale-90 transition-all hover:bg-[#0A66C2] hover:text-white flex-shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </button>

            {/* X (formerly Twitter) */}
            <button
              onClick={handleShareX}
              title="Post on X"
              aria-label="Post on X"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-neutral-500/15 text-neutral-800 dark:text-neutral-200 active:scale-90 transition-all hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black flex-shrink-0"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              title="Share on Facebook"
              aria-label="Share on Facebook"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#1877F2]/15 text-[#1877F2] active:scale-90 transition-all hover:bg-[#1877F2] hover:text-white flex-shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              title="Send via WhatsApp"
              aria-label="Send via WhatsApp"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#25D366]/15 text-[#25D366] active:scale-90 transition-all hover:bg-[#25D366] hover:text-white flex-shrink-0"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </button>

            {/* Email */}
            <button
              onClick={handleShareEmail}
              title="Email Colleague"
              aria-label="Email Colleague"
              className="w-9 h-9 rounded-full flex items-center justify-center bg-[#FF6B1A]/15 text-[#FF6B1A] active:scale-90 transition-all hover:bg-[#FF6B1A] hover:text-white flex-shrink-0"
            >
              <Mail className="w-4 h-4" />
            </button>

            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              title="Copy Link"
              aria-label="Copy Link"
              className={`w-9 h-9 rounded-full flex items-center justify-center border active:scale-90 transition-all flex-shrink-0 ${
                copiedLink
                  ? 'border-[#10B981] bg-[#10B981] text-white shadow-sm shadow-[#10B981]/40'
                  : 'border-current/20 hover:border-[#FF6B1A] hover:text-[#FF6B1A]'
              }`}
            >
              {copiedLink ? <Check className="w-4 h-4 text-white" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      )}

      {/* DESKTOP VIEW (>= md): EXPANDED RICH MENU UNDER BUTTON */}
      {isOpen && (
        <div
          className={`hidden md:block absolute right-0 top-full mt-2 z-50 w-80 p-3 rounded-2xl shadow-2xl backdrop-blur-xl border transition-all duration-200 ${
            isDark
              ? 'bg-[#0D0D0D]/95 border-white/15 text-white shadow-black/80'
              : 'bg-white/95 border-black/15 text-[#0A0A0A] shadow-black/10'
          }`}
        >
          <div className="px-3 py-2 border-b border-current/10 flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold">
              SHARE WITH YOUR NETWORK
            </span>
            <span className="text-[10px] font-mono opacity-50">Instant Share</span>
          </div>

          <div className="py-2 space-y-1">
            {/* LinkedIn */}
            <button
              onClick={handleShareLinkedIn}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#FF6B1A]/10 hover:text-[#FF6B1A] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0A66C2]/15 text-[#0A66C2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-tight">LinkedIn</div>
                <div className="text-[10px] opacity-60 truncate">Share to professional feed</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B1A]" />
            </button>

            {/* X (formerly Twitter) */}
            <button
              onClick={handleShareX}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#FF6B1A]/10 hover:text-[#FF6B1A] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-neutral-500/15 text-neutral-800 dark:text-neutral-200 flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-tight">X (formerly Twitter)</div>
                <div className="text-[10px] opacity-60 truncate">Post to your followers</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B1A]" />
            </button>

            {/* Facebook */}
            <button
              onClick={handleShareFacebook}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#FF6B1A]/10 hover:text-[#FF6B1A] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#1877F2]/15 text-[#1877F2] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-tight">Facebook</div>
                <div className="text-[10px] opacity-60 truncate">Share to timeline or group</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B1A]" />
            </button>

            {/* WhatsApp */}
            <button
              onClick={handleShareWhatsApp}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#FF6B1A]/10 hover:text-[#FF6B1A] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#25D366]/15 text-[#25D366] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-tight">WhatsApp</div>
                <div className="text-[10px] opacity-60 truncate">Send to chat or contacts</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B1A]" />
            </button>

            {/* Email */}
            <button
              onClick={handleShareEmail}
              className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-left hover:bg-[#FF6B1A]/10 hover:text-[#FF6B1A] transition-colors group"
            >
              <div className="w-8 h-8 rounded-lg bg-[#FF6B1A]/15 text-[#FF6B1A] flex items-center justify-center flex-shrink-0 group-hover:bg-[#FF6B1A] group-hover:text-white transition-colors">
                <Mail className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-xs font-bold leading-tight">Email Colleague</div>
                <div className="text-[10px] opacity-60 truncate">Send direct link via email</div>
              </div>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 group-hover:text-[#FF6B1A]" />
            </button>
          </div>

          <div className="pt-2 border-t border-current/10">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-mono border transition-all ${
                copiedLink
                  ? 'border-[#10B981] bg-[#10B981]/10 text-[#10B981]'
                  : 'border-current/15 hover:border-[#FF6B1A] hover:text-[#FF6B1A]'
              }`}
            >
              <div className="flex items-center gap-2">
                {copiedLink ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5" />}
                <span className="font-bold">{copiedLink ? 'Link Copied to Clipboard!' : 'Copy Direct Link'}</span>
              </div>
              {copiedLink && <span className="text-[10px] text-[#10B981] font-bold">COPIED</span>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BlogPostPage({
  slug,
  isDark,
  onNavigateBlog,
  onNavigatePost,
  onNavigateHome,
  onOpenAudit
}) {
  // Find post by slug or default to first
  const post = BLOG_POSTS.find((p) => p.slug === slug) || BLOG_POSTS[0];

  // Get the other related articles
  const relatedPosts = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  return (
    <div className="pt-24 sm:pt-32 pb-24">
      <div className="max-w-[1000px] mx-auto px-4 sm:px-8 lg:px-10">
        {/* Breadcrumb Navigation Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 sm:pb-8 border-b border-current/10 mb-10 sm:mb-12">
          <button
            onClick={onNavigateBlog}
            className="group flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] opacity-75 hover:opacity-100 hover:text-[#FF6B1A] transition-all"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to All Articles</span>
          </button>
          <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A]">
            <span>{post.category}</span>
            <span>•</span>
            <span>FIELD PLAYBOOK</span>
          </div>
        </div>

        {/* Article Header & Title */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-wrap items-center gap-3 mb-5 text-[11px] font-mono uppercase tracking-widest">
            <span className="px-3 py-1 rounded-full bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold border border-[#FF6B1A]/20">
              {post.category}
            </span>
            <span className="opacity-60 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" /> {post.publishDate}
            </span>
            <span className="opacity-60">•</span>
            <span className="opacity-60 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> {post.readTime}
            </span>
            <span className="opacity-60">•</span>
            <span className="text-[#FF6B1A] font-semibold">{post.heroMetric}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight leading-[1.12]">
            {post.title}
          </h1>

          <p className="mt-5 text-base sm:text-xl opacity-80 leading-relaxed font-normal">
            {post.subtitle}
          </p>

          {/* Author & Share Bar: Responsive flex layout */}
          <div
            className={`mt-8 p-4 sm:p-5 rounded-2xl border flex items-center justify-between gap-3 sm:gap-4 ${
              isDark ? 'bg-white/[0.03] border-white/10' : 'bg-black/[0.02] border-black/10'
            }`}
          >
            <div className="flex items-center gap-3 sm:gap-3.5 min-w-0">
              <img
                src={post.author.avatar}
                alt={post.author.name}
                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-[#FF6B1A] shadow-md shadow-[#FF6B1A]/10 flex-shrink-0"
              />
              <div className="min-w-0">
                <div className="font-bold text-xs sm:text-base flex items-center gap-1.5 sm:gap-2 truncate">
                  <span className="truncate">{post.author.name}</span>
                  <span className="text-[9px] sm:text-[10px] font-mono px-1.5 sm:px-2 py-0.5 rounded bg-[#FF6B1A]/15 text-[#FF6B1A] font-bold flex-shrink-0">
                    AUTHOR
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs opacity-70 mt-0.5 truncate">{post.author.role}</div>
              </div>
            </div>

            {/* Multi-Feature Share Dropdown */}
            <div className="flex-shrink-0">
              <SocialShareDropdown post={post} isDark={isDark} />
            </div>
          </div>
        </header>

        {/* Executive Summary & Key Takeaways Card */}
        <section
          className={`p-6 sm:p-8 rounded-3xl border mb-12 sm:mb-16 ${
            isDark
              ? 'bg-gradient-to-br from-[#0E0E0E] to-[#060606] border-white/15 shadow-xl'
              : 'bg-gradient-to-br from-white to-[#F6F5F0] border-black/15 shadow-lg'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-mono uppercase tracking-[0.2em] text-[#FF6B1A] font-bold mb-4">
            <Sparkles className="w-4 h-4" />
            <span>EXECUTIVE SUMMARY &amp; KEY TAKEAWAYS</span>
          </div>
          <div className="space-y-3">
            {post.takeaways.map((takeaway, idx) => (
              <div key={idx} className="flex items-start gap-3 text-sm sm:text-base leading-relaxed">
                <CheckCircle2 className="w-5 h-5 text-[#10B981] flex-shrink-0 mt-0.5" />
                <span className="opacity-90">{takeaway}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Full Article Content */}
        <main className="space-y-8 text-base sm:text-lg leading-relaxed opacity-90 pb-12 border-b border-current/10">
          {post.content.map((block, idx) => {
            if (block.type === 'heading') {
              return (
                <h2
                  key={idx}
                  className="text-2xl sm:text-3xl font-extrabold tracking-tight pt-6 pb-2 text-[#0A0A0A] dark:text-white flex items-center gap-2"
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-[#FF6B1A]" />
                  <span>{block.text}</span>
                </h2>
              );
            }
            if (block.type === 'list') {
              return (
                <div
                  key={idx}
                  className={`p-6 rounded-2xl border my-6 ${
                    isDark ? 'bg-white/[0.02] border-white/10' : 'bg-black/[0.02] border-black/10'
                  }`}
                >
                  <div className="text-xs font-mono uppercase tracking-widest text-[#FF6B1A] font-bold mb-4">
                    IMPLEMENTATION CHECKLIST:
                  </div>
                  <ul className="space-y-3">
                    {block.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-3 text-sm sm:text-base">
                        <CheckCircle2 className="w-4 h-4 text-[#FF6B1A] flex-shrink-0 mt-1" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            }
            return (
              <p key={idx} className="text-sm sm:text-base opacity-85 leading-relaxed">
                {block.text}
              </p>
            );
          })}
        </main>

        {/* Author Bio & Bottom Share Action Bar: Responsive flex layout */}
        <div
          className={`my-12 p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 ${
            isDark ? 'bg-[#0A0A0A] border-white/10' : 'bg-white border-black/10 shadow-sm'
          }`}
        >
          <div className="flex items-center gap-4 sm:gap-5 max-w-xl">
            <img
              src={post.author.avatar}
              alt={post.author.name}
              className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover border-2 border-[#FF6B1A] flex-shrink-0"
            />
            <div>
              <div className="text-[10px] sm:text-xs font-mono uppercase tracking-widest text-[#FF6B1A] font-bold mb-1">
                ABOUT THE AUTHOR
              </div>
              <h3 className="text-base sm:text-lg font-bold">{post.author.name}</h3>
              <p className="text-[11px] sm:text-xs font-mono opacity-60 mb-1 sm:mb-2">{post.author.role}</p>
              <p className="text-xs sm:text-sm opacity-80 leading-relaxed font-normal">
                {post.author.bio}
              </p>
            </div>
          </div>

          <div className="flex-shrink-0 self-end sm:self-center">
            <SocialShareDropdown post={post} isDark={isDark} />
          </div>
        </div>

        {/* Related Articles Strip */}
        <section className="my-16">
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-current/10">
            <div>
              <div className="text-xs font-mono uppercase tracking-widest text-[#FF6B1A] font-bold">
                CONTINUE READING
              </div>
              <h3 className="text-2xl font-extrabold tracking-tight mt-1">
                More Playbooks from the Growth Desk
              </h3>
            </div>
            <button
              onClick={onNavigateBlog}
              className="text-xs font-mono uppercase tracking-widest hover:text-[#FF6B1A] transition-colors hidden sm:inline"
            >
              View All Articles →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {relatedPosts.map((related) => (
              <div
                key={related.id}
                role="button"
                tabIndex={0}
                onClick={() => onNavigatePost(related.slug)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onNavigatePost(related.slug);
                  }
                }}
                className={`group cursor-pointer rounded-2xl border p-6 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-[#FF6B1A] ${
                  isDark
                    ? 'bg-[#0A0A0A] border-white/10 hover:border-[#FF6B1A]/50'
                    : 'bg-white border-black/10 hover:border-[#FF6B1A]/50 shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono uppercase tracking-widest mb-3">
                    <span className="px-2 py-0.5 rounded bg-[#FF6B1A]/10 text-[#FF6B1A] font-bold">
                      {related.category}
                    </span>
                    <span className="opacity-60">{related.readTime}</span>
                  </div>
                  <h4 className="text-lg font-bold group-hover:text-[#FF6B1A] transition-colors leading-snug">
                    {related.title}
                  </h4>
                  <p className="mt-2 text-xs opacity-75 line-clamp-2 leading-relaxed">
                    {related.subtitle}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-current/10 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={related.author.avatar}
                      alt={related.author.name}
                      className="w-6 h-6 rounded-full object-cover border border-[#FF6B1A]"
                    />
                    <span className="font-semibold text-[11px]">{related.author.name}</span>
                  </div>
                  <span className="text-[#FF6B1A] font-bold group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    <span>Read</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Local Growth CTA Banner */}
        <div
          className={`rounded-3xl p-8 sm:p-12 border relative overflow-hidden ${
            isDark
              ? 'bg-gradient-to-br from-[#0D0D0D] to-[#050505] border-white/15'
              : 'bg-gradient-to-br from-white to-[#F0EFEA] border-black/15 shadow-xl'
          }`}
        >
          <div className="max-w-2xl relative z-10">
            <span className="text-xs font-mono uppercase tracking-[0.25em] text-[#FF6B1A] font-bold block mb-3">
              TERRITORY EXCLUSIVE DEPLOYMENT
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              Want These Systems Deployed in Your Service Area?
            </h3>
            <p className="mt-3 text-sm sm:text-base opacity-80 leading-relaxed">
              We engineer complete local growth systems for one business per category per geographic radius. Book a 100% free technical audit to analyze your local map rankings, site speed, and missed-call leakage.
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <button
                onClick={onOpenAudit}
                className="px-6 py-3.5 bg-[#FF6B1A] hover:bg-[#ff5500] text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-lg shadow-[#FF6B1A]/25 transition-all hover:scale-[1.02]"
              >
                Claim Free Growth Audit →
              </button>
              <button
                onClick={onNavigateBlog}
                className="px-6 py-3.5 border border-current/20 hover:border-[#FF6B1A] text-xs font-bold uppercase tracking-widest rounded-lg transition-colors"
              >
                Back to All Articles
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
