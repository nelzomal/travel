import React, { useState } from 'react';
import { Site, UserReview, ReviewerRole, TripPreference } from '../../types/travel';
import { 
  Star, Heart, MessageSquare, Share2, Check, Sparkles, 
  UserCheck, AlertCircle, Trash2, Edit2, ThumbsUp, ThumbsDown
} from 'lucide-react';

interface SiteCollaborationReviewProps {
  site: Site;
  onUpdateSite: (updatedSite: Site) => void;
}

export const DEFAULT_REVIEWERS = {
  reviewer1: { name: '爸爸', avatar: '👨', roleTitle: '主要规划' },
  reviewer2: { name: '妈妈', avatar: '👩', roleTitle: '亲子督导' },
};

export const SiteCollaborationReview: React.FC<SiteCollaborationReviewProps> = ({
  site,
  onUpdateSite
}) => {
  const reviews = site.reviews || [];
  const r1Review = reviews.find((r) => r.reviewerId === 'reviewer1');
  const r2Review = reviews.find((r) => r.reviewerId === 'reviewer2');

  const [activeReviewerId, setActiveReviewerId] = useState<ReviewerRole>('reviewer1');
  const [copiedLink, setCopiedLink] = useState(false);

  // Reviewer Names State (Customizable)
  const [reviewerConfig, setReviewerConfig] = useState(DEFAULT_REVIEWERS);

  // Active form state initialized from existing review
  const currentReview = activeReviewerId === 'reviewer1' ? r1Review : r2Review;
  const currentProfile = reviewerConfig[activeReviewerId];

  const [kidScore, setKidScore] = useState<number>(currentReview?.kidRating || site.kidRating || 4);
  const [elderlyScore, setElderlyScore] = useState<number>(currentReview?.elderlyRating || site.elderlyRating || 4);
  const [strollerScore, setStrollerScore] = useState<number>(currentReview?.strollerRating || site.strollerRating || 4);
  const [overallScore, setOverallScore] = useState<number>(currentReview?.overallRating || 4);
  const [preference, setPreference] = useState<TripPreference>(currentReview?.preference || 'must_go');
  const [comment, setComment] = useState<string>(currentReview?.comment || '');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // When switching reviewer tabs, sync form state
  const handleSwitchReviewer = (role: ReviewerRole) => {
    setActiveReviewerId(role);
    const targetRev = role === 'reviewer1' ? r1Review : r2Review;
    setKidScore(targetRev?.kidRating || site.kidRating || 4);
    setElderlyScore(targetRev?.elderlyRating || site.elderlyRating || 4);
    setStrollerScore(targetRev?.strollerRating || site.strollerRating || 4);
    setOverallScore(targetRev?.overallRating || 4);
    setPreference(targetRev?.preference || 'must_go');
    setComment(targetRev?.comment || '');
    setSaveSuccess(false);
  };

  const handleSaveMyReview = () => {
    const updatedReview: UserReview = {
      reviewerId: activeReviewerId,
      reviewerName: currentProfile.name,
      reviewerAvatar: currentProfile.avatar,
      kidRating: kidScore,
      elderlyRating: elderlyScore,
      strollerRating: strollerScore,
      overallRating: overallScore,
      preference,
      comment: comment.trim(),
      updatedAt: new Date().toISOString()
    };

    const newReviews = (site.reviews || []).filter((r) => r.reviewerId !== activeReviewerId);
    newReviews.push(updatedReview);

    onUpdateSite({
      ...site,
      reviews: newReviews
    });

    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleDeleteReview = (role: ReviewerRole) => {
    if (!confirm(`确定清除【${reviewerConfig[role].name}】的评分与评价吗？`)) return;
    const newReviews = (site.reviews || []).filter((r) => r.reviewerId !== role);
    onUpdateSite({
      ...site,
      reviews: newReviews
    });
    if (activeReviewerId === role) {
      setComment('');
      setOverallScore(4);
    }
  };

  const handleCopyShareLink = () => {
    const shareUrl = `${window.location.origin}${window.location.pathname}#/sites?site=${encodeURIComponent(site.id)}&review=1`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  // Quick preset tags to insert into comment
  const quickTags = [
    '✨ 4岁宝宝肯定超级喜欢',
    '🪑 绿荫与休息长椅充足',
    '🍼 母婴哺乳设施非常完善',
    '⚠️ 台阶较多需绕行坡道',
    '☔ 室内空调雨天首选',
    '🚕 建议打车直达更省力',
    '🍣 周边餐饮适合老人小孩'
  ];

  // Consensus Calculation
  const bothRated = !!r1Review && !!r2Review;
  const avgOverall = bothRated 
    ? ((r1Review.overallRating + r2Review.overallRating) / 2).toFixed(1)
    : (r1Review?.overallRating || r2Review?.overallRating || 0).toFixed(1);

  const getConsensusBadge = () => {
    if (!r1Review && !r2Review) {
      return {
        bg: 'bg-slate-100 text-slate-600 border-slate-200',
        icon: '💭',
        title: '双人尚未评分',
        desc: '欢迎 2 人分别打分，系统将自动汇总意见与分歧点。'
      };
    }
    if (!bothRated) {
      const ratedName = r1Review ? reviewerConfig.reviewer1.name : reviewerConfig.reviewer2.name;
      const unratedName = r1Review ? reviewerConfig.reviewer2.name : reviewerConfig.reviewer1.name;
      return {
        bg: 'bg-amber-50 text-amber-900 border-amber-200',
        icon: '⏳',
        title: `已由【${ratedName}】完成评分，等待【${unratedName}】打分`,
        desc: '点击右侧「复制链接」可直接发给同伴/伴侣进行协同评价。'
      };
    }

    // Both Rated
    if (r1Review.preference === 'must_go' && r2Review.preference === 'must_go') {
      return {
        bg: 'bg-emerald-50 text-emerald-900 border-emerald-300',
        icon: '🌟',
        title: '双方高度共识：一致推荐【必去】！',
        desc: `综合推荐指数 ★${avgOverall} / 5.0，双方均给予高度认可。`
      };
    }

    if (r1Review.preference === 'skip' && r2Review.preference === 'skip') {
      return {
        bg: 'bg-rose-50 text-rose-900 border-rose-300',
        icon: '🚫',
        title: '双方一致建议【跳过/不推荐】',
        desc: '双方均认为不太适合本家庭，建议从排期中移除以节省体力。'
      };
    }

    if (
      (r1Review.preference === 'must_go' && r2Review.preference === 'skip') ||
      (r1Review.preference === 'skip' && r2Review.preference === 'must_go')
    ) {
      return {
        bg: 'bg-orange-50 text-orange-900 border-orange-300',
        icon: '⚖️',
        title: '存在意见分歧：一人推荐必去，一人建议跳过',
        desc: '建议重点查看下方双方的评语与顾虑，决定是否作为备选。'
      };
    }

    return {
      bg: 'bg-indigo-50 text-indigo-900 border-indigo-200',
      icon: '🤝',
      title: `双人综合评审完成（综合评级 ★${avgOverall}）`,
      desc: '双方意向基本一致，可作为常规或弹性备选景点。'
    };
  };

  const consensus = getConsensusBadge();

  return (
    <div className="space-y-6">
      
      {/* 1. Consensus Assessment Banner */}
      <div className={`p-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-2xs ${consensus.bg}`}>
        <div className="flex items-start gap-3">
          <span className="text-2xl">{consensus.icon}</span>
          <div>
            <h4 className="text-xs sm:text-sm font-extrabold">{consensus.title}</h4>
            <p className="text-[11px] opacity-80 mt-0.5">{consensus.desc}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleCopyShareLink}
          title="复制此景点专属直达打分链接发给对方"
          className="px-3 py-1.5 bg-white/90 hover:bg-white text-slate-800 rounded-xl text-xs font-bold shadow-2xs border border-black/10 flex items-center gap-1.5 transition-all flex-shrink-0"
        >
          {copiedLink ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>链接已复制!</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>发给对方打分</span>
            </>
          )}
        </button>
      </div>

      {/* 2. Side-by-Side Dual Review Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Reviewer 1 (e.g. 爸爸) Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          r1Review 
            ? 'bg-slate-50/80 border-slate-200 shadow-2xs' 
            : 'bg-slate-50/40 border-dashed border-slate-300'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-xl">{reviewerConfig.reviewer1.avatar}</span>
              <div>
                <span className="text-xs font-bold text-slate-800">{reviewerConfig.reviewer1.name}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({reviewerConfig.reviewer1.roleTitle})</span>
              </div>
            </div>

            {r1Review ? (
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  r1Review.preference === 'must_go' ? 'bg-emerald-100 text-emerald-800' :
                  r1Review.preference === 'nice_to_have' ? 'bg-amber-100 text-amber-800' :
                  r1Review.preference === 'skip' ? 'bg-rose-100 text-rose-800' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {r1Review.preference === 'must_go' ? '🟢 必去' :
                   r1Review.preference === 'nice_to_have' ? '🟡 备选想去' :
                   r1Review.preference === 'skip' ? '🔴 建议跳过' : '⚪ 都可以'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteReview('reviewer1')}
                  title="删除此条评分"
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                <span>⏳ 暂未评分</span>
              </span>
            )}
          </div>

          {r1Review ? (
            <div className="mt-3 space-y-2.5">
              <div className="grid grid-cols-4 gap-1 bg-white p-2 rounded-xl border border-slate-200/60 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">4岁娃喜爱</div>
                  <div className="text-xs font-bold text-amber-600">★ {r1Review.kidRating}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">长辈舒适</div>
                  <div className="text-xs font-bold text-indigo-600">★ {r1Review.elderlyRating}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">推车平缓</div>
                  <div className="text-xs font-bold text-emerald-600">★ {r1Review.strollerRating}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">综合推荐</div>
                  <div className="text-xs font-bold text-rose-600">★ {r1Review.overallRating}</div>
                </div>
              </div>

              {r1Review.comment ? (
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-500 mr-1">💬 评价:</span>
                  {r1Review.comment}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">未填写文字评价</div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              请在下方选择【{reviewerConfig.reviewer1.name}】进行打分
            </div>
          )}
        </div>

        {/* Reviewer 2 (e.g. 妈妈) Card */}
        <div className={`p-4 rounded-2xl border transition-all ${
          r2Review 
            ? 'bg-slate-50/80 border-slate-200 shadow-2xs' 
            : 'bg-slate-50/40 border-dashed border-slate-300'
        }`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
            <div className="flex items-center gap-2">
              <span className="text-xl">{reviewerConfig.reviewer2.avatar}</span>
              <div>
                <span className="text-xs font-bold text-slate-800">{reviewerConfig.reviewer2.name}</span>
                <span className="text-[10px] text-slate-400 ml-1.5 font-medium">({reviewerConfig.reviewer2.roleTitle})</span>
              </div>
            </div>

            {r2Review ? (
              <div className="flex items-center gap-1.5">
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold ${
                  r2Review.preference === 'must_go' ? 'bg-emerald-100 text-emerald-800' :
                  r2Review.preference === 'nice_to_have' ? 'bg-amber-100 text-amber-800' :
                  r2Review.preference === 'skip' ? 'bg-rose-100 text-rose-800' :
                  'bg-slate-200 text-slate-700'
                }`}>
                  {r2Review.preference === 'must_go' ? '🟢 必去' :
                   r2Review.preference === 'nice_to_have' ? '🟡 备选想去' :
                   r2Review.preference === 'skip' ? '🔴 建议跳过' : '⚪ 都可以'}
                </span>
                <button
                  type="button"
                  onClick={() => handleDeleteReview('reviewer2')}
                  title="删除此条评分"
                  className="text-slate-400 hover:text-rose-600 p-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <span className="text-[11px] text-amber-600 font-semibold flex items-center gap-1">
                <span>⏳ 暂未评分</span>
              </span>
            )}
          </div>

          {r2Review ? (
            <div className="mt-3 space-y-2.5">
              <div className="grid grid-cols-4 gap-1 bg-white p-2 rounded-xl border border-slate-200/60 text-center">
                <div>
                  <div className="text-[10px] text-slate-400">4岁娃喜爱</div>
                  <div className="text-xs font-bold text-amber-600">★ {r2Review.kidRating}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">长辈舒适</div>
                  <div className="text-xs font-bold text-indigo-600">★ {r2Review.elderlyRating}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">推车平缓</div>
                  <div className="text-xs font-bold text-emerald-600">★ {r2Review.strollerRating}</div>
                </div>
                <div>
                  <div className="text-[10px] text-slate-400">综合推荐</div>
                  <div className="text-xs font-bold text-rose-600">★ {r2Review.overallRating}</div>
                </div>
              </div>

              {r2Review.comment ? (
                <div className="p-2.5 bg-white rounded-xl border border-slate-200/60 text-xs text-slate-700 leading-relaxed">
                  <span className="font-semibold text-slate-500 mr-1">💬 评价:</span>
                  {r2Review.comment}
                </div>
              ) : (
                <div className="text-[11px] text-slate-400 italic">未填写文字评价</div>
              )}
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-400">
              请在下方选择【{reviewerConfig.reviewer2.name}】进行打分
            </div>
          )}
        </div>

      </div>

      {/* 3. Interactive Review Form for Current Reviewer */}
      <div className="bg-slate-50 rounded-3xl p-5 border border-slate-200 space-y-4">
        
        {/* Switch Reviewer Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-700">当前评价身份:</span>
            <div className="flex items-center bg-white p-1 rounded-xl border border-slate-200 shadow-2xs">
              <button
                type="button"
                onClick={() => handleSwitchReviewer('reviewer1')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeReviewerId === 'reviewer1'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{reviewerConfig.reviewer1.avatar}</span>
                <span>{reviewerConfig.reviewer1.name}</span>
              </button>

              <button
                type="button"
                onClick={() => handleSwitchReviewer('reviewer2')}
                className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all ${
                  activeReviewerId === 'reviewer2'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <span>{reviewerConfig.reviewer2.avatar}</span>
                <span>{reviewerConfig.reviewer2.name}</span>
              </button>
            </div>
          </div>

          <span className="text-[11px] text-slate-400">
            {currentReview ? '正在修改已提交的评分' : '尚未提交过评分'}
          </span>
        </div>

        {/* Sliders / Star Ratings for Multi-Gen Criteria */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* 1. 4yo Kid Suitability */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>🧒</span> 4岁幼童喜爱度
              </span>
              <span className="text-xs font-extrabold text-amber-600">{kidScore} 星</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setKidScore(star)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    star <= kidScore
                      ? 'bg-amber-100 text-amber-800 border border-amber-300'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* 2. Elderly Comfort */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>🧓</span> 长辈舒适度
              </span>
              <span className="text-xs font-extrabold text-indigo-600">{elderlyScore} 星</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setElderlyScore(star)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    star <= elderlyScore
                      ? 'bg-indigo-100 text-indigo-800 border border-indigo-300'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* 3. Stroller Smoothness */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>🚼</span> 推车平缓度
              </span>
              <span className="text-xs font-extrabold text-emerald-600">{strollerScore} 星</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setStrollerScore(star)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    star <= strollerScore
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Overall Recommendation */}
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 flex items-center gap-1">
                <span>✨</span> 个人综合推荐
              </span>
              <span className="text-xs font-extrabold text-rose-600">{overallScore} 星</span>
            </div>
            <div className="flex items-center justify-between gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setOverallScore(star)}
                  className={`flex-1 py-1 rounded-lg text-xs font-bold transition-all ${
                    star <= overallScore
                      ? 'bg-rose-100 text-rose-800 border border-rose-300'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  ★ {star}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Preference Selector */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-slate-700">
            您的意愿态度决策:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPreference('must_go')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                preference === 'must_go'
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>🟢</span>
              <span>强烈推荐·必去</span>
            </button>

            <button
              type="button"
              onClick={() => setPreference('nice_to_have')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                preference === 'nice_to_have'
                  ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>🟡</span>
              <span>挺想去·建议备选</span>
            </button>

            <button
              type="button"
              onClick={() => setPreference('neutral')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                preference === 'neutral'
                  ? 'bg-slate-800 text-white border-slate-800 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>⚪</span>
              <span>中立·听大家意见</span>
            </button>

            <button
              type="button"
              onClick={() => setPreference('skip')}
              className={`p-2 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${
                preference === 'skip'
                  ? 'bg-rose-600 text-white border-rose-600 shadow-xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>🔴</span>
              <span>顾虑较多·建议跳过</span>
            </button>
          </div>
        </div>

        {/* Written Review Textarea & Quick Tags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-slate-700 flex items-center justify-between">
            <span>写下您的评价与看法（顾虑、体验要点或游玩建议）:</span>
            <span className="text-[10px] text-slate-400 font-normal">支持直接输入或点击下方快捷标签</span>
          </label>

          <textarea
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder={`作为【${currentProfile.name}】，我对这个景点的看法是（例如：午休后带娃来刚好合适；台阶稍多需注意长辈体力；或者门票需提前预约等）...`}
            className="w-full p-3 bg-white rounded-2xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-2xs leading-relaxed"
          />

          {/* Quick Preset Tag Pills */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] text-slate-400 font-semibold">快速插入:</span>
            {quickTags.map((t, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setComment((prev) => (prev ? `${prev}；${t}` : t));
                }}
                className="px-2 py-0.5 bg-white hover:bg-indigo-50 hover:text-indigo-600 rounded-lg text-[10px] text-slate-600 border border-slate-200 transition-colors"
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Save Review Button */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleSaveMyReview}
            className={`px-5 py-2.5 rounded-2xl text-xs font-extrabold flex items-center gap-2 shadow-md transition-all ${
              saveSuccess
                ? 'bg-emerald-600 text-white'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/20'
            }`}
          >
            {saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>已保存并同步写入！</span>
              </>
            ) : (
              <>
                <span>💾 保存【{currentProfile.name}】的评分与评价</span>
              </>
            )}
          </button>
        </div>

      </div>

    </div>
  );
};
