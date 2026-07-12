// AuraBible Web Application Controller
// Orchestrates local state, database lookups, page transitions, and UI interactions.

document.addEventListener('DOMContentLoaded', () => {
  // --- 1. STATE MANAGEMENT ---
  const API_BASE = window.location.protocol === 'file:' ? 'http://localhost:3000' : '';
  const DEFAULT_STATE = {
    profile: { ...window.BIBLE_DATA.profile },
    saved: {
      highlights: [
        { id: 'h1', bookId: 'PSA', chapter: 23, verseNum: 4, text: 'Even though I walk through the valley of the shadow of death...', color: 'yellow', translation: 'WEB', time: 'Yesterday' },
        { id: 'h2', bookId: 'ROM', chapter: 12, verseNum: 2, text: 'Don’t be conformed to this world, but be transformed...', color: 'green', translation: 'WEB', time: '2 days ago' }
      ],
      bookmarks: [
        { id: 'b1', bookId: 'JHN', chapter: 1, verseNum: 1, text: 'In the beginning was the Word...', translation: 'WEB', time: '3 days ago' }
      ],
      notes: [
        { id: 'n1', bookId: 'ROM', chapter: 12, verseNum: 1, text: 'Sacrificing my own comforts daily to serve others.', noteText: 'A powerful reminder that worship is active, not just singing on Sundays.', translation: 'WEB', time: '2 days ago' }
      ]
    },
    plansProgress: {
      active: { planId: 'anxiety', currentDay: 1, completedDays: [] },
      completed: []
    },
    prayers: [...window.BIBLE_DATA.community.prayers],
    sermons: [
      {
        id: 's-1',
        title: 'Building on the Rock',
        speaker: 'Pastor John MacArthur',
        passage: 'Matthew 7:24-27',
        notes: '1. Hear Christ\'s words and do them.\n2. The storms of life will test every foundation.\n3. The house built on obedience stands firm.',
        time: '3 hours ago'
      }
    ],
    community: {
      feed: [...window.BIBLE_DATA.community.feed],
      friends: [...window.BIBLE_DATA.community.friends]
    },
    meetings: [...window.BIBLE_DATA.meetings],
    settings: {
      darkMode: false,
      notifications: true,
      offline: true,
      systemLanguage: 'en',
      reader: {
        fontSize: 24,
        lineHeight: 1.6,
        verseLayout: 'paragraph'
      }
    },
    readerState: {
      bookId: 'GEN',
      chapter: 1,
      translation: 'WEB'
    },
    ui: {
      bibleFontSize: 24,
      bibleFontSerif: true,
      selectedVersion: 'WEB',
      highlightColor: null,
      quickNote: ''
    },
    votdIndex: (new Date().getDate() % window.BIBLE_DATA.votdList.length),
    customPlans: []
  };

  const UI_TRANSLATIONS = {
    en: {
      navHome: 'Home',
      navBible: 'Bible',
      navPlans: 'Plans',
      navPrayer: 'Prayer',
      navCommunity: 'Community',
      navMeetings: 'Meetings',
      navSaved: 'Saved',
      
      settingsTitle: 'Application Preferences',
      settingsDarkMode: 'Dark Theme',
      settingsDarkModeDesc: 'Toggle night mode for comfortable reading.',
      settingsDailyReminders: 'Daily Reminders',
      settingsDailyRemindersDesc: 'Receive notifications to read your devotional.',
      settingsOffline: 'Offline Mode Sync',
      settingsOfflineDesc: 'Cache and save downloaded versions locally.',
      
      settingsSysLang: 'System Language',
      settingsSysLangDesc: 'Change the language of the application interface.',
      settingsBibleVer: 'Bible Version & Translation',
      settingsBibleVerDesc: 'Select your default Holy Bible translation version.',
      
      settingsClear: 'Clear Local Cache',
      settingsClearDesc: 'Reset all reading logs, streaks, and saved items.',
      settingsResetBtn: 'Reset Data',

      homeVotdTag: 'Verse of the Day',
      homeVotdBtnText: 'Read Chapter',
      homeDevoTag: "Today's Reflection",
      homeDevoDate: 'July 6',
      homeDevoTitle: "Rest in the Shepherd's Care",
      homeDevoExcerpt: 'In a world full of checklists and constant noise, God invites us to lie down in green pastures...',
      homeDevoBtn: 'Read Devotional',
      homePlansTitle: 'Recommended Reading Plans',
      homeActiveTag: 'Active Plan',
      homeActiveContinueText: 'Continue Reading',
      homeQuickTitle: 'Quick Tools',
      quickReader: 'Reader',
      quickPrayer: 'Add Prayer',
      quickSaved: 'My Saved',
      quickPlans: 'All Plans',
      sidebarStreakText: 'day streak',

      modalSelectBook: 'Select Book',
      modalSelectChapter: 'Select Chapter',
      modalSelectVersion: 'Select Translation',
      modalReadingSettings: 'Reading Settings',
      modalAddNote: 'Add Study Note',
      modalShareCard: 'Create Share Card',
      modalScheduleRoom: 'Schedule Fellowship Room',
      settingsTextSize: 'Text Size',
      settingsLineSpacing: 'Line Spacing',
      settingsVerseLayout: 'Verse Layout',
      settingsLayoutParagraph: 'Continuous Paragraph',
      settingsLayoutVerse: 'Verse by Verse',
      btnTabOt: 'Old Testament',
      btnTabNt: 'New Testament',
      sessionTabDevo: 'Devotional',
      sessionTabScripture: 'Scripture',
      sessionTabReflect: 'Reflection & Prayer',
      sessionPrevBtn: 'Previous',
      sessionNextBtn: 'Next Step',
      planDetailDaysTitle: 'Devotional Days',
      planDetailSaveBtn: 'Save for Later',
      plansHeaderTitle: 'Featured Reading Plans',
      labelCreatePlanBtn: 'Create Custom Plan',
      createPlanModalTitle: 'Create Custom Reading Plan',
      createPlanTitleLabel: 'Plan Title',
      createPlanCategoryLabel: 'Category',
      createPlanDescLabel: 'Description',
      createPlanDaysLabel: 'Plan Days & Content',
      createPlanAddDayBtn: '+ Add Day',
      createPlanSaveBtn: 'Save Plan',
      filterPrayersAll: 'All',
      filterPrayersAnswered: 'Answered',
      filterMeetingsAll: 'All Rooms',
      filterMeetingsLive: 'Live Now',
      meetingsBannerTag: 'Live Fellowship',
      meetingsBannerHeader: 'Online Meeting Rooms',
      meetingsBannerText: 'Connect instantly with other readers via live video fellowship, morning prayer circles, and scripture discussions on Zoom.',
      meetingsScheduleBtnText: 'Schedule Room',
      meetingsActiveHeader: 'Active & Upcoming Fellowship Rooms',
      communityFeedHeader: 'Shared Activity Feed',
      communityFriendsHeader: 'Friends Activity',
      savedTabHighlights: 'Highlights',
      savedTabBookmarks: 'Bookmarks',
      savedTabNotes: 'Notes',
      prayerComposerHeader: 'What are you praying for today?',
      prayerShareLabel: 'Share with friends',
      prayerJournalHeader: 'My Prayer Journal',
      prayerSidebarHeader: 'The Power of Prayer',
      prayerSidebarText: 'Writing down prayers helps us remember God\'s faithfulness over time. You can mark prayers as answered, keep them private, or share them with friends to request encouragement.',
      prayerSubmitBtn: 'Save Prayer',
      readerPrevChapter: '← Previous Chapter',
      readerNextChapter: 'Next Chapter →',
      shareCardStyleLabel: 'Select Theme Style',
      shareCardBgLabel: 'Peace & Custom Backgrounds',
      navSermons: 'Sermons',
      sermonsComposerHeader: 'Record a New Sermon',
      sermonsListHeader: 'My Sermon Journal',
      sermonsSidebarHeader: 'Keep Sermon Notes',
      sermonsSubmitBtn: 'Save Sermon Notes',
      searchPlaceholder: 'Search references, keywords, plans...'
    },
    vi: {
      navHome: 'Trang chủ',
      navBible: 'Kinh Thánh',
      navPlans: 'Kế hoạch',
      navPrayer: 'Cầu nguyện',
      navCommunity: 'Cộng đồng',
      navMeetings: 'Nhóm họp',
      navSaved: 'Đã lưu',
      
      settingsTitle: 'Tùy chọn ứng dụng',
      settingsDarkMode: 'Chế độ tối',
      settingsDarkModeDesc: 'Bật chế độ ban đêm để đọc thoải mái hơn.',
      settingsDailyReminders: 'Nhắc nhở hàng ngày',
      settingsDailyRemindersDesc: 'Nhận thông báo để đọc bài tĩnh nguyện.',
      settingsOffline: 'Đồng bộ ngoại tuyến',
      settingsOfflineDesc: 'Lưu trữ và đồng bộ các phiên bản đã tải xuống.',
      
      settingsSysLang: 'Ngôn ngữ hệ thống',
      settingsSysLangDesc: 'Thay đổi ngôn ngữ hiển thị của giao diện ứng dụng.',
      settingsBibleVer: 'Bản dịch Kinh Thánh',
      settingsBibleVerDesc: 'Chọn bản dịch Kinh Thánh mặc định của bạn.',
      
      settingsClear: 'Xóa bộ nhớ đệm',
      settingsClearDesc: 'Đặt lại tất cả nhật ký đọc, lượt đọc liên tiếp và các mục đã lưu.',
      settingsResetBtn: 'Đặt lại dữ liệu',

      homeVotdTag: 'Câu Kinh Thánh trong ngày',
      homeVotdBtnText: 'Đọc Cả Chương',
      homeDevoTag: 'Suy ngẫm hôm nay',
      homeDevoDate: 'Ngày 6 tháng 7',
      homeDevoTitle: 'Nghỉ ngơi trong sự chăn dắt của Đấng Chăn Chiên',
      homeDevoExcerpt: 'Trong một thế giới đầy những danh sách việc cần làm và tiếng ồn liên tục, Chúa mời gọi chúng ta nằm nghỉ trong đồng cỏ xanh tươi...',
      homeDevoBtn: 'Đọc bài tĩnh nguyện',
      homePlansTitle: 'Kế hoạch gợi ý',
      homeActiveTag: 'Kế hoạch đang đọc',
      homeActiveContinueText: 'Đọc tiếp tục',
      homeQuickTitle: 'Công cụ nhanh',
      quickReader: 'Đọc Kinh Thánh',
      quickPrayer: 'Cầu nguyện',
      quickSaved: 'Đã lưu',
      quickPlans: 'Tất cả kế hoạch',
      sidebarStreakText: 'ngày liên tiếp',

      modalSelectBook: 'Chọn Sách Kinh Thánh',
      modalSelectChapter: 'Chọn Chương',
      modalSelectVersion: 'Chọn Bản Dịch',
      modalReadingSettings: 'Cấu Hình Đọc',
      modalAddNote: 'Thêm Ghi Chú Học Tập',
      modalShareCard: 'Tạo Thẻ Chia Sẻ',
      modalScheduleRoom: 'Lên Lịch Phòng Thông Công',
      settingsTextSize: 'Kích Thước Chữ',
      settingsLineSpacing: 'Khoảng Cách Dòng',
      settingsVerseLayout: 'Bố Cục Đọc',
      settingsLayoutParagraph: 'Đoạn Văn Liên Tục',
      settingsLayoutVerse: 'Tách Biệt Từng Câu',
      btnTabOt: 'Cựu Ước',
      btnTabNt: 'Tân Ước',
      sessionTabDevo: 'Bài tĩnh nguyện',
      sessionTabScripture: 'Kinh Thánh',
      sessionTabReflect: 'Suy ngẫm & Cầu nguyện',
      sessionPrevBtn: 'Quay lại',
      sessionNextBtn: 'Bước tiếp theo',
      planDetailDaysTitle: 'Các Ngày Tĩnh Nguyện',
      planDetailSaveBtn: 'Lưu để đọc sau',
      plansHeaderTitle: 'Kế Hoạch Đọc Kinh Thánh',
      labelCreatePlanBtn: 'Tạo Kế Hoạch Riêng',
      createPlanModalTitle: 'Tạo Kế Hoạch Đọc Riêng',
      createPlanTitleLabel: 'Tiêu Đề Kế Hoạch',
      createPlanCategoryLabel: 'Thể Loại',
      createPlanDescLabel: 'Mô Tả',
      createPlanDaysLabel: 'Nội Dung Các Ngày',
      createPlanAddDayBtn: '+ Thêm Ngày',
      createPlanSaveBtn: 'Lưu Kế Hoạch',
      filterPrayersAll: 'Tất cả',
      filterPrayersAnswered: 'Đã nhậm lời',
      filterMeetingsAll: 'Tất cả',
      filterMeetingsLive: 'Đang diễn ra',
      meetingsBannerTag: 'Thông Công Trực Tuyến',
      meetingsBannerHeader: 'Phòng Họp Trực Tuyến',
      meetingsBannerText: 'Kết nối ngay lập tức với các độc giả khác thông qua các buổi họp thông công video trực tuyến, vòng cầu nguyện buổi sáng và thảo luận Kinh Thánh trên Zoom.',
      meetingsScheduleBtnText: 'Lên Lịch Phòng',
      meetingsActiveHeader: 'Phòng Thông Công Đang & Sắp Diễn Ra',
      communityFeedHeader: 'Bảng Tin Hoạt Động Chung',
      communityFriendsHeader: 'Hoạt Động Của Bạn Bè',
      savedTabHighlights: 'Tô Màu',
      savedTabBookmarks: 'Đánh Dấu',
      savedTabNotes: 'Ghi Chú',
      prayerComposerHeader: 'Bạn muốn cầu xin điều gì hôm nay?',
      prayerShareLabel: 'Chia sẻ với bạn bè',
      prayerJournalHeader: 'Nhật Ký Cầu Nguyện',
      prayerSidebarHeader: 'Quyền Năng Của Sự Cầu Nguyện',
      prayerSidebarText: 'Viết ra các lời cầu nguyện giúp chúng ta nhớ đến sự thành tín của Đức Chúa Trời theo thời gian. Bạn có thể đánh dấu đã nhậm lời, giữ riêng tư hoặc chia sẻ với bạn bè để nhận sự khích lệ.',
      prayerSubmitBtn: 'Lưu Lời Cầu Nguyện',
      readerPrevChapter: '← Chương Trước',
      readerNextChapter: 'Chương Sau →',
      shareCardStyleLabel: 'Chọn Kiểu Giao Diện',
      shareCardBgLabel: 'Hình Nền Tĩnh Nguyện & Tự Chọn',
      navSermons: 'Bài giảng',
      sermonsComposerHeader: 'Ghi lại bài giảng mới',
      sermonsListHeader: 'Nhật ký Bài giảng',
      sermonsSubmitBtn: 'Lưu Ghi Chép',
      searchPlaceholder: 'Tìm kiếm tham chiếu, từ khóa, kế hoạch...'
    }
  };

  const BIBLE_BOOK_LOCALIZATION = {
    vi: {
      GEN: 'Sáng-thế-ký',
      EXO: 'Xuất Ê-díp-tô Ký',
      LEV: 'Lê-vi Ký',
      NUM: 'Dân-số Ký',
      DEU: 'Phục-truyền Luật-lệ Ký',
      JOS: 'Giê-suê',
      JDG: 'Các Quan Xét',
      RUT: 'Ru-tơ',
      '1SA': '1 Sa-mu-ên',
      '2SA': '2 Sa-mu-ên',
      '1KI': '1 Các Vua',
      '2KI': '2 Các Vua',
      '1CH': '1 Sử-ký',
      '2CH': '2 Sử-ký',
      EZR: 'Ê-xơ-ra',
      NEH: 'Nê-hê-mi',
      EST: 'Ê-xơ-tê',
      JOB: 'Gióp',
      PSA: 'Thi-thiên',
      PRO: 'Châm-ngôn',
      ECC: 'Truyền-đạo',
      SNG: 'Nhã-ca',
      ISA: 'Ê-sai',
      JER: 'Giê-rê-mi',
      LAM: 'Ca-thương',
      EZK: 'Ê-xê-chi-ên',
      DAN: 'Đa-ni-ên',
      HOS: 'Ô-sê',
      JOL: 'Giô-ên',
      AMO: 'A-mốt',
      OBD: 'Áp-đia',
      JON: 'Giô-nát',
      MIC: 'Mi-chê',
      NAH: 'Na-hu-mê',
      HAB: 'Ha-ba-cúc',
      ZEP: 'Sô-phô-ni',
      HAG: 'A-ghê',
      ZEC: 'Xa-cha-ri',
      MAL: 'Ma-la-chi',
      MAT: 'Ma-thi-ơ',
      MRK: 'Mác',
      LUK: 'Lu-ca',
      JHN: 'Giăng',
      ACT: 'Công-vụ các Sứ-đồ',
      ROM: 'Rô-ma',
      '1CO': '1 Cô-rinh-tô',
      '2CO': '2 Cô-rinh-tô',
      GAL: 'Ga-la-ti',
      EPH: 'Ê-phê-sô',
      PHP: 'Phi-líp',
      COL: 'Cô-lô-se',
      '1TH': '1 Tê-sa-lô-ni-ca',
      '2TH': '2 Tê-sa-lô-ni-ca',
      '1TI': '1 Ti-mô-thê',
      '2TI': '2 Ti-mô-thê',
      TIT: 'Tít',
      PHM: 'Phi-lê-môn',
      HEB: 'Hê-bơ-rơ',
      JAS: 'Gia-cơ',
      '1PE': '1 Phi-e-rơ',
      '2PE': '2 Phi-e-rơ',
      '1JN': '1 Giăng',
      '2JN': '2 Giăng',
      '3JN': '3 Giăng',
      JUD: 'Giu-đê',
      REV: 'Khải-huyền'
    }
  };

  function getBookName(bookId) {
    const lang = state.settings.systemLanguage || 'en';
    if (lang === 'vi' && BIBLE_BOOK_LOCALIZATION.vi[bookId]) {
      return BIBLE_BOOK_LOCALIZATION.vi[bookId];
    }
    const book = window.BIBLE_DATA.books.find(b => b.id === bookId);
    return book ? book.name : bookId;
  }

  const PLAN_TRANSLATIONS = {
    vi: {
      // Categories
      'anxiety': 'Lo âu',
      'relationships': 'Mối quan hệ',
      'hope': 'Hy vọng',
      'sermons': 'Bài giảng',
      'Sermons': 'Bài giảng',
      
      // Difficulties
      'Easy': 'Dễ',
      'Medium': 'Trung bình',
      'Hard': 'Khó',
      
      // Titles
      'Finding Peace in Anxiety': 'Tìm kiếm bình an trong lo âu',
      'Walk in Divine Love': 'Bước đi trong tình yêu thiên thượng',
      'A Living Hope': 'Hy vọng sống',
      
      // Descriptions
      'A gentle 3-day devotional plan designed to calm your heart, quiet your thoughts, and anchor your mind in divine peace.': 'Kế hoạch tĩnh nguyện 3 ngày nhẹ nhàng giúp làm yên lòng, dịu suy nghĩ, và neo đậu tâm trí bạn trong sự bình an thiên thượng.',
      'Explore the depths of unconditional love and how to reflect it in your daily interactions, family, and friendships.': 'Khám phá chiều sâu của tình yêu vô điều kiện và cách phản chiếu tình yêu đó trong các mối quan hệ, gia đình và tình bạn hàng ngày.',
      'Rebuild your expectations and restore your joy through scriptures that anchor your soul in eternal hope.': 'Tái dựng những kỳ vọng và phục hồi niềm vui của bạn thông qua các câu Kinh Thánh giúp neo giữ tâm hồn bạn trong niềm hy vọng đời đời.',
      'Sermon on the Mount': 'Bài Giảng Trên Núi',
      'Dive deep into Jesus\' core teachings on character, integrity, and faith in the Sermon on the Mount.': 'Đi sâu vào những lời dạy cốt lõi của Chúa Giê-xu về tính cách, sự liêm chính và đức tin trong Bài Giảng Trên Núi.',

      // Day Titles
      'Cast Your Cares': 'Trao Mọi Lo Âu',
      'Renewing Your Mind': 'Đổi Mới Tâm Trí',
      'Walking in the Light': 'Bước Đi Trong Ánh Sáng',
      'The Blueprint of Love': 'Bản Thiết Kế Tình Yêu',
      'Humility and Unity': 'Khiêm Nhường và Hiệp Nhất',
      'Love in Action': 'Tình Yêu Bằng Hành Động',
      'New Beginnings': 'Khởi Đầu Mới',
      'Restoring Joy': 'Phục Hồi Niềm Vui',
      'The Word of Hope': 'Lời Của Hy Vọng',
      'Salt and Light': 'Muối và Ánh Sáng',
      'Do Not Worry': 'Đừng Lo Lắng',
      'The Wise Builder': 'Người Xây Nhà Khôn Ngoan'
    }
  };

  function translatePlanField(text) {
    if (!text) return '';
    const lang = state.settings.systemLanguage || 'en';
    const key = text.trim();
    const keyLower = key.toLowerCase();
    
    if (lang === 'vi') {
      if (PLAN_TRANSLATIONS.vi[key]) {
        return PLAN_TRANSLATIONS.vi[key];
      }
      if (PLAN_TRANSLATIONS.vi[keyLower]) {
        return PLAN_TRANSLATIONS.vi[keyLower];
      }
    }
    return text;
  }

  function getAllPlans() {
    return [...window.BIBLE_DATA.plans, ...(state.customPlans || [])];
  }

  function translateTime(timeStr) {
    if (!timeStr) return '';
    const lang = state.settings.systemLanguage || 'en';
    if (lang !== 'vi') return timeStr;
    
    let t = timeStr.trim().toLowerCase();
    if (t === 'yesterday') return 'Hôm qua';
    if (t === 'just now') return 'Vừa xong';
    if (t === '2 days ago') return '2 ngày trước';
    if (t === '3 days ago') return '3 ngày trước';
    
    t = t.replace('logged ', 'Đã ghi nhận ');
    t = t.replace(' mins ago', ' phút trước');
    t = t.replace(' min ago', ' phút trước');
    t = t.replace(' hours ago', ' giờ trước');
    t = t.replace(' hour ago', ' giờ trước');
    t = t.replace(' days ago', ' ngày trước');
    t = t.replace(' day ago', ' ngày trước');
    
    return t;
  }

  function translateActivityDetail(detail) {
    if (!detail) return '';
    const lang = state.settings.systemLanguage || 'en';
    if (lang !== 'vi') return detail;
    
    let d = detail;
    if (d.includes('highlighted')) {
      d = d.replace('highlighted', 'đã tô màu');
      d = d.replace('Psalm', 'Thi-thiên');
      d = d.replace('Genesis', 'Sáng-thế-ký');
      d = d.replace('Romans', 'Rô-ma');
      d = d.replace('John', 'Giăng');
      d = d.replace(' in ', ' bằng bản dịch ');
    }
    if (d.includes('completed Day')) {
      d = d.replace('completed Day', 'đã hoàn thành Ngày');
      d = d.replace('of', 'của');
      d = d.replace('Finding Peace in Anxiety', 'Tìm kiếm bình an trong lo âu');
      d = d.replace('Walk in Divine Love', 'Bước đi trong tình yêu thiên thượng');
      d = d.replace('A Living Hope', 'Hy vọng sống');
    }
    return d;
  }

  function translateMeetingTime(timeStr) {
    if (!timeStr) return '';
    const lang = state.settings.systemLanguage || 'en';
    if (lang !== 'vi') return timeStr;
    
    let t = timeStr.trim();
    let tLower = t.toLowerCase();
    if (tLower === 'live') return 'Đang diễn ra';
    
    t = t.replace('Today at', 'Hôm nay lúc');
    t = t.replace('Every Sunday at', 'Chủ nhật hàng tuần lúc');
    t = t.replace('Every Monday at', 'Thứ hai hàng tuần lúc');
    t = t.replace('Every Tuesday at', 'Thứ ba hàng tuần lúc');
    t = t.replace('Every Wednesday at', 'Thứ tư hàng tuần lúc');
    t = t.replace('Every Thursday at', 'Thứ năm hàng tuần lúc');
    t = t.replace('Every Friday at', 'Thứ sáu hàng tuần lúc');
    t = t.replace('Every Saturday at', 'Thứ bảy hàng tuần lúc');
    t = t.replace('Every Day at', 'Hàng ngày lúc');
    
    return t;
  }

  let state = { ...DEFAULT_STATE };

  // Load state from LocalStorage
  function loadState() {
    const savedState = localStorage.getItem('aurabible_state');
    if (savedState) {
      try {
        state = JSON.parse(savedState);
        // Ensure nested structures are preserved
        if (!state.saved) state.saved = DEFAULT_STATE.saved;
        if (!state.plansProgress) state.plansProgress = DEFAULT_STATE.plansProgress;
        if (!state.prayers) state.prayers = DEFAULT_STATE.prayers;
        if (!state.sermons) state.sermons = DEFAULT_STATE.sermons;
        if (!state.community) state.community = DEFAULT_STATE.community;
        if (!state.meetings) state.meetings = DEFAULT_STATE.meetings;
        if (!state.settings) state.settings = DEFAULT_STATE.settings;
        if (!state.settings.reader) state.settings.reader = DEFAULT_STATE.settings.reader;
        if (!state.settings.reader.verseLayout) state.settings.reader.verseLayout = 'paragraph';
        if (!state.settings.systemLanguage) state.settings.systemLanguage = 'en';
        if (!state.readerState) state.readerState = DEFAULT_STATE.readerState;
        if (!state.ui) state.ui = { ...DEFAULT_STATE.ui };
        if (state.votdIndex === undefined) state.votdIndex = DEFAULT_STATE.votdIndex;
        if (!state.customPlans) state.customPlans = [];
      } catch (e) {
        state = { ...DEFAULT_STATE };
      }
    }
  }

  // Enforce streak verification based on real calendar days passed
  function verifyStreakValidity() {
    if (!state.profile) return;
    const todayStr = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
    const isGuest = localStorage.getItem('aurabible_guest') === 'true';
    const token = localStorage.getItem('aurabible_token');
    
    let keySuffix = 'guest';
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        keySuffix = payload.id;
      } catch(e) {}
    }
    
    const storageKey = `aurabible_last_streak_date_${keySuffix}`;
    const lastDateStr = localStorage.getItem(storageKey);
    
    if (!lastDateStr) {
      state.profile.todayCompleted = false;
      return;
    }
    
    if (lastDateStr === todayStr) {
      state.profile.todayCompleted = true;
      return;
    }
    
    const today = new Date(todayStr + 'T00:00:00');
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toLocaleDateString('en-CA');
    
    if (lastDateStr === yesterdayStr) {
      state.profile.todayCompleted = false;
    } else {
      // Missed yesterday! Streak resets
      state.profile.streak = 0;
      state.profile.todayCompleted = false;
      saveState();
    }
  }

  // Save state
  function saveState() {
    const token = localStorage.getItem('aurabible_token');
    if (token) {
      fetch(API_BASE + '/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          saved: state.saved,
          prayers: state.prayers,
          settings: state.settings
        })
      })
      .catch(err => console.error('Error syncing state:', err));
    } else {
      localStorage.setItem('aurabible_state', JSON.stringify(state));
    }
  }

  // --- 1.5. HTML TEMPLATES AND DYNAMIC INJECTION ---
  const TEMPLATES = {
    searchDrawer: `
      <div class="search-header">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h3>Global Search</h3>
          <button class="header-btn" id="search-drawer-close" aria-label="Close search">
            <svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>
        <div class="search-input-wrapper">
          <svg viewBox="0 0 24 24" width="18" height="18" stroke="var(--text-muted)" fill="none" stroke-width="2" style="margin-right:8px;"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
          <input type="text" class="search-input" id="search-keyword-input" placeholder="Search references, keywords, plans...">
        </div>
      </div>
      <div class="search-results" id="search-results-list">
        <div style="text-align:center; margin-top:40px; color:var(--text-muted);">
          <p>Type to search AuraBible content...</p>
        </div>
      </div>
    `,
    bookSelect: `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-select-book-title">Select Book</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="padding:0;">
          <div class="saved-tabs" style="padding:0 24px;">
            <button class="saved-tab-btn active" id="btn-tab-ot">Old Testament</button>
            <button class="saved-tab-btn" id="btn-tab-nt">New Testament</button>
          </div>
          <div class="interactive-list" id="modal-books-list" style="padding: 24px; max-height:400px; overflow-y:auto;"></div>
        </div>
      </div>
    `,
    chapterSelect: `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-select-chapter-title">Select Chapter</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="max-height:400px; overflow-y:auto;">
          <div style="display:grid; grid-template-columns:repeat(5, 1fr); gap:12px;" id="modal-chapters-grid"></div>
        </div>
      </div>
    `,
    versionSelect: `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-select-version-title">Select Translation</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body">
          <div class="interactive-list" id="modal-versions-list"></div>
        </div>
      </div>
    `,
    fontConfig: `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width:400px;">
        <div class="modal-header">
          <h3 id="modal-reading-settings-title">Reading Settings</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body">
          <div class="font-controls-group">
            <div class="control-slider-row">
              <div style="display:flex; justify-content:space-between;">
                <label id="settings-text-size-label">Text Size</label>
                <span id="font-size-value">24px</span>
              </div>
              <input type="range" class="slider-input" id="slider-font-size" min="16" max="36" value="24">
            </div>
            <div class="control-slider-row">
              <div style="display:flex; justify-content:space-between;">
                <label id="settings-line-spacing-label">Line Spacing</label>
                <span id="line-height-value">1.6</span>
              </div>
              <input type="range" class="slider-input" id="slider-line-height" min="12" max="22" value="16" step="1">
            </div>
            <div class="control-slider-row" style="margin-top: 16px;">
              <div style="display:flex; justify-content:space-between; margin-bottom: 8px;">
                <label id="settings-layout-label" style="font-weight: 500;">Verse Layout</label>
              </div>
              <select class="select-input" id="select-verse-layout" style="width:100%; padding:10px 12px; border-radius:var(--radius-sm); border:1px solid var(--border-color); background-color:var(--bg-secondary); color:var(--text-primary); font-size:14px; outline:none; cursor:pointer;">
                <option value="paragraph" id="opt-layout-paragraph">Continuous Paragraph</option>
                <option value="verse" id="opt-layout-verse">Verse by Verse</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    `,
    floatingActionBar: `
      <div class="highlight-dots">
        <div class="dot yellow" data-color="yellow" title="Yellow Highlight"></div>
        <div class="dot green" data-color="green" title="Green Highlight"></div>
        <div class="dot blue" data-color="blue" title="Blue Highlight"></div>
        <div class="dot pink" data-color="pink" title="Pink Highlight"></div>
        <div class="dot custom-color" style="position:relative; background: linear-gradient(135deg, #ff5e62, #ff9966, #ffdb01, #7fed41, #318bfb, #b732fb); border: 1px solid var(--border-color); cursor:pointer;" title="Choose Custom Color">
          <input type="color" id="custom-highlight-color-picker" style="position:absolute; top:0; left:0; width:100%; height:100%; opacity:0; cursor:pointer; padding:0; border:none;">
        </div>
        <div class="dot clear" data-color="clear" title="Clear Highlight"></div>
      </div>
      <div style="width:1px; height:24px; background-color:var(--border-color);"></div>
      <div style="display:flex; gap:12px;">
        <button class="btn btn-secondary btn-icon-only" id="actionbar-bookmark" style="width:36px; height:36px;" title="Bookmark">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path></svg>
        </button>
        <button class="btn btn-secondary btn-icon-only" id="actionbar-note" style="width:36px; height:36px;" title="Add Note">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
        </button>
        <button class="btn btn-secondary btn-icon-only" id="actionbar-share" style="width:36px; height:36px;" title="Create Share Card">
          <svg viewBox="0 0 24 24" width="16" height="16"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
        </button>
      </div>
    `,
    addNote: `
      <div class="modal-overlay"></div>
      <div class="modal-content">
        <div class="modal-header">
          <h3 id="modal-add-note-title">Add Study Note</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:16px;">
          <div style="font-family:'Lora', Georgia, serif; font-style:italic; font-size:18px; padding:12px; background-color:var(--bg-primary); border-radius:8px;" id="note-verse-context"></div>
          <textarea id="note-text-input" style="width:100%; height:120px; padding:12px; border:1px solid var(--border-color); border-radius:8px; resize:none;" placeholder="Write down your thoughts, cross-references, or life application..."></textarea>
          <button class="btn btn-primary" id="note-save-btn">Save Note</button>
        </div>
      </div>
    `,
    planDetail: `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px;">
        <div class="modal-header">
          <h3 id="plan-detail-title">Reading Plan Title</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:20px;">
          <div>
            <span class="card-tag" id="plan-detail-tag">Category</span>
            <span style="font-size: 13px; color:var(--text-muted); margin-left:12px;" id="plan-detail-meta">3 days • Easy</span>
          </div>
          <p style="color:var(--text-secondary); font-size:14px; line-height:1.6;" id="plan-detail-desc"></p>
          <div>
            <h4 style="margin-bottom:12px;" id="plan-detail-days-title">Devotional Days</h4>
            <div class="outline-list" id="plan-detail-outline"></div>
          </div>
          <div style="display:flex; gap:12px; margin-top:8px;">
            <button class="btn btn-primary" style="flex-grow:1;" id="plan-detail-action-btn">Start Plan</button>
            <button class="btn btn-secondary" id="plan-detail-save-btn">Save for Later</button>
          </div>
        </div>
      </div>
    `,
    planSession: `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 700px; max-height:90vh;">
        <div class="modal-header">
          <div>
            <h4 id="session-plan-name" style="font-size:12px; color:var(--text-muted); font-weight:600; text-transform:uppercase;">Finding Peace</h4>
            <h3 id="session-day-title">Day 1: Cast Your Cares</h3>
          </div>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="overflow-y:auto; display:flex; flex-direction:column; gap:24px;">
          <div class="saved-tabs" style="margin-bottom:0;">
            <button class="saved-tab-btn active" id="btn-session-devo">Devotional</button>
            <button class="saved-tab-btn" id="btn-session-scripture">Scripture</button>
            <button class="saved-tab-btn" id="btn-session-reflect">Reflection & Prayer</button>
          </div>
          <div id="session-devo-section" class="session-tab-content">
            <p id="session-devotional-text" style="font-size:16px; line-height:1.7; color:var(--text-secondary);"></p>
          </div>
          <div id="session-scripture-section" class="session-tab-content" style="display:none;">
            <div id="session-scripture-reference" style="font-weight:700; color:var(--accent-color); margin-bottom:12px; font-size:16px;">PSA 23:1-6</div>
            <div id="session-scripture-body" style="font-family:'Lora', Georgia, serif; font-size:22px; line-height:1.6; padding:16px; background-color:var(--bg-primary); border-radius:8px;"></div>
          </div>
          <div id="session-reflect-section" class="session-tab-content" style="display:none; display:flex; flex-direction:column; gap:16px;">
            <div style="background-color: var(--bg-primary); padding:20px; border-radius:8px;">
              <h4 style="margin-bottom:6px; font-size:14px; color:var(--accent-color);">Reflection Question:</h4>
              <p id="session-reflection-prompt" style="font-size:14px; font-weight:500;"></p>
            </div>
            <div style="background-color: var(--bg-primary); padding:20px; border-radius:8px;">
              <h4 style="margin-bottom:6px; font-size:14px; color:var(--accent-color);">Prayer Focus:</h4>
              <p id="session-prayer-prompt" style="font-size:14px; font-style:italic;"></p>
            </div>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; border-top: 1px solid var(--border-color); padding-top:20px; margin-top:auto;">
            <button class="btn btn-secondary" id="session-prev-tab-btn" style="visibility:hidden;">Previous</button>
            <button class="btn btn-primary" id="session-action-btn">Next Step</button>
          </div>
        </div>
      </div>
    `,
    shareCard: `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 800px;">
        <div class="modal-header">
          <h3 id="modal-share-card-title">Create Share Card</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:20px; align-items:center;">
          <div id="verse-card-canvas" style="width:100%; height:auto; border-radius:16px; display:flex; flex-direction:column; gap:24px; padding:40px 32px; text-align:left; color:#FFFFFF; background: linear-gradient(135deg, #5C6E58, #3b4c37); box-shadow:0 12px 30px rgba(0,0,0,0.15); transition:var(--transition-smooth); box-sizing:border-box;">
            <div style="font-family:'Lora', Georgia, serif; font-size:18px; line-height:1.6; font-style:italic; text-align:left; width:100%;" id="share-card-text">
              “The Lord is my shepherd; I shall not want.”
            </div>
            <div style="width:100%; height:1px; background-color:currentColor; opacity:0.25;"></div>
            <div style="display:flex; justify-content:space-between; align-items:center; width:100%;">
              <div style="font-size:12px; font-weight:700; text-transform:uppercase; letter-spacing:0.05em;" id="share-card-ref">
                Psalm 23:1
              </div>
              <div style="font-size:10px; font-weight:600; opacity:0.6;">AuraBible</div>
            </div>
          </div>
          <div style="width:100%; display:flex; flex-direction:column; gap:16px;">
            <div>
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:8px; display:block;" id="share-card-style-label">Select Theme Style</label>
              <div style="display:flex; gap:12px; justify-content:center;">
                <button class="dot" style="width:36px; height:36px; background: linear-gradient(135deg, #5C6E58, #3b4c37);" data-bg="linear-gradient(135deg, #5C6E58, #3b4c37)" data-color="#FFFFFF"></button>
                <button class="dot" style="width:36px; height:36px; background: linear-gradient(135deg, #b08d57, #7c5c2d);" data-bg="linear-gradient(135deg, #b08d57, #7c5c2d)" data-color="#FFFFFF"></button>
                <button class="dot" style="width:36px; height:36px; background: linear-gradient(135deg, #536976, #292E49);" data-bg="linear-gradient(135deg, #536976, #292E49)" data-color="#FFFFFF"></button>
                <button class="dot" style="width:36px; height:36px; background: linear-gradient(135deg, #e9dcd3, #ebd4c3); border: 1px solid var(--border-color);" data-bg="linear-gradient(135deg, #e9dcd3, #ebd4c3)" data-color="#2C2A24"></button>
                <button class="dot" style="width:36px; height:36px; background: linear-gradient(135deg, #232526, #414345);" data-bg="linear-gradient(135deg, #232526, #414345)" data-color="#FFFFFF"></button>
              </div>
            </div>
            <div>
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:8px; display:block;" id="share-card-bg-label">Peace & Custom Backgrounds</label>
              <div style="display:flex; gap:12px; justify-content:center; align-items:center;">
                <button class="dot" style="width:36px; height:36px; border-radius:50%; background:url('peace_background_1.png') center/cover; border:1px solid var(--border-color);" data-bg="url('peace_background_1.png') center/cover no-repeat" data-color="#FFFFFF" title="Lake Mist"></button>
                <button class="dot" style="width:36px; height:36px; border-radius:50%; background:url('peace_background_2.png') center/cover; border:1px solid var(--border-color);" data-bg="url('peace_background_2.png') center/cover no-repeat" data-color="#FFFFFF" title="Sunset Hills"></button>
                <button class="dot" style="width:36px; height:36px; border-radius:50%; background:url('peace_background_3.png') center/cover; border:1px solid var(--border-color);" data-bg="url('peace_background_3.png') center/cover no-repeat" data-color="#FFFFFF" title="Starry Cosmos"></button>
                <button class="btn btn-secondary btn-icon-only" id="btn-upload-bg-trigger" style="width:36px; height:36px; border-radius:50%; display:inline-flex; align-items:center; justify-content:center; padding:0; border:1px solid var(--border-color);" title="Upload custom background from device">
                  <svg viewBox="0 0 24 24" width="16" height="16"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                </button>
                <input type="file" id="share-card-upload-image" accept="image/*" style="display:none;">
              </div>
            </div>
            <div>
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary); margin-bottom:8px; display:block;">Customize Text Style & Color</label>
              <div style="display:flex; gap:12px; justify-content:center;">
                <button class="btn btn-secondary btn-sm" id="btn-share-text-color" style="padding:6px 12px; font-size:12px; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"/><path d="M12 18C15.3137 18 18 15.3137 18 12C18 8.68629 15.3137 6 12 6"/></svg>
                  Text Color
                </button>
                <button class="btn btn-secondary btn-sm" id="btn-share-text-font" style="padding:6px 12px; font-size:12px; display:inline-flex; align-items:center; gap:6px;">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 7 4 4 20 4 20 7"></polyline><line x1="9" y1="20" x2="15" y2="20"></line><line x1="12" y1="4" x2="12" y2="20"></line></svg>
                  Text Font
                </button>
              </div>
            </div>
          </div>
          <button class="btn btn-primary" style="width:100%;" id="btn-share-download">Copy to Clipboard</button>
        </div>
      </div>
    `,
    createPlan: `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 600px; max-height: 85vh; display:flex; flex-direction:column;">
        <div class="modal-header">
          <h3 id="create-plan-modal-title">Create Custom Reading Plan</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="overflow-y:auto; flex-grow:1; display:flex; flex-direction:column; gap:16px; padding-bottom:16px;">
          <div style="display:grid; grid-template-columns: 2fr 1fr; gap:12px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary);" id="create-plan-title-label">Plan Title</label>
              <input type="text" id="create-plan-input-title" placeholder="e.g. 3 Days of Gratitude" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background-color:var(--bg-primary);">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary);" id="create-plan-category-label">Category</label>
              <select id="create-plan-input-category" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background-color:var(--bg-primary); color:var(--text-primary);">
                <option value="anxiety">Anxiety / Lo âu</option>
                <option value="relationships">Relationships / Mối quan hệ</option>
                <option value="hope">Hope / Hy vọng</option>
                <option value="sermons">Sermons / Bài giảng</option>
                <option value="custom">Custom / Khác</option>
              </select>
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:12px; font-weight:600; color:var(--text-secondary);" id="create-plan-desc-label">Description</label>
            <textarea id="create-plan-input-desc" placeholder="What is the focus of this reading plan?" style="width:100%; height:60px; padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; resize:none; background-color:var(--bg-primary);"></textarea>
          </div>
          <div style="border-top:1px solid var(--border-color); padding-top:16px;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
              <h4 style="margin:0;" id="create-plan-days-label">Plan Days & Content</h4>
              <button class="btn btn-secondary" id="create-plan-btn-add-day" style="padding:6px 12px; font-size:12px; font-weight:600;">+ Add Day</button>
            </div>
            <div id="create-plan-days-container" style="display:flex; flex-direction:column; gap:16px;"></div>
          </div>
        </div>
        <div class="modal-footer" style="padding: 16px 24px 24px 24px; border-top:1px solid var(--border-color); display:flex; justify-content:flex-end;">
          <button class="btn btn-primary" id="create-plan-btn-save" style="width:100%;">Save Plan</button>
        </div>
      </div>
    `,
    zoomCreate: `
      <div class="modal-overlay"></div>
      <div class="modal-content" style="max-width: 500px; position: relative;">
        <div class="modal-header">
          <h3 id="modal-schedule-room-title">Schedule Fellowship Room</h3>
          <button class="header-btn modal-close-btn"><svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></button>
        </div>
        <div class="modal-body" style="display:flex; flex-direction:column; gap:16px;">
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Room Topic / Title</label>
            <input type="text" id="zoom-input-title" placeholder="e.g. Genesis 1 Reflection Group" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background-color:var(--bg-primary);">
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Description</label>
            <textarea id="zoom-input-desc" placeholder="What will this group discuss?" style="width:100%; height:70px; padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; resize:none; background-color:var(--bg-primary);"></textarea>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Schedule Type</label>
            <div class="segmented-control" style="display:flex; gap:8px; width:100%;">
              <button type="button" class="segment-btn active" id="segment-one-time" style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 14px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:var(--transition-smooth); border:none; background-color:var(--accent-color); color:var(--accent-text); box-shadow: 0 4px 12px rgba(92,110,88,0.2);">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="margin:0;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
                One-time
              </button>
              <button type="button" class="segment-btn" id="segment-recurring" style="flex:1; display:flex; align-items:center; justify-content:center; gap:8px; padding:10px 14px; border-radius:8px; font-size:13px; font-weight:600; cursor:pointer; transition:var(--transition-smooth); border:1px solid var(--border-color); background-color:transparent; color:var(--text-muted);">
                <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="margin:0;"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg>
                Recurring
              </button>
            </div>
            <input type="hidden" id="zoom-input-schedule-type" value="one-time">
          </div>
          <div id="zoom-schedule-one-time-fields" style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Start Time</label>
              <input type="text" id="zoom-input-time" placeholder="e.g. Today at 7:00 PM" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background-color:var(--bg-primary);">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Duration</label>
              <div class="tumbler-picker-wrapper" style="position:relative; height:44px; overflow:hidden; background-color:var(--bg-primary); border:1px solid var(--border-color); border-radius:8px; user-select:none;">
                <div class="tumbler-center-highlight" style="position:absolute; top:50%; transform:translateY(-50%); left:0; right:0; height:34px; border-top:1px solid rgba(255,255,255,0.08); border-bottom:1px solid rgba(255,255,255,0.08); pointer-events:none; background:rgba(255,255,255,0.02);"></div>
                <div class="tumbler-wheel" id="zoom-duration-tumbler-wheel" style="position:absolute; top:0; left:0; right:0; bottom:0; overflow-y:scroll; scroll-snap-type:y mandatory; scrollbar-width:none; -ms-overflow-style:none;"></div>
                <div class="tumbler-overlay-top" style="position:absolute; top:0; left:0; right:0; height:5px; background:linear-gradient(to bottom, var(--bg-primary) 10%, rgba(18,18,16,0) 100%); pointer-events:none;"></div>
                <div class="tumbler-overlay-bottom" style="position:absolute; bottom:0; left:0; right:0; height:5px; background:linear-gradient(to top, var(--bg-primary) 10%, rgba(18,18,16,0) 100%); pointer-events:none;"></div>
              </div>
              <input type="hidden" id="zoom-input-duration" value="60">
            </div>
          </div>
          <div id="zoom-schedule-recurring-fields" style="display:none; grid-template-columns:1fr 1fr; gap:12px; align-items:flex-start;">
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Recurrence</label>
              <div class="tumbler-picker-wrapper" style="position:relative; height:44px; overflow:hidden; background-color:var(--bg-primary); border:1px solid var(--border-color); border-radius:8px; user-select:none;">
                <div class="tumbler-center-highlight" style="position:absolute; top:50%; transform:translateY(-50%); left:0; right:0; height:34px; border-top:1px solid rgba(255,255,255,0.08); border-bottom:1px solid rgba(255,255,255,0.08); pointer-events:none; background:rgba(255,255,255,0.02);"></div>
                <div class="tumbler-wheel" id="zoom-tumbler-wheel" style="position:absolute; top:0; left:0; right:0; bottom:0; overflow-y:scroll; scroll-snap-type:y mandatory; scrollbar-width:none; -ms-overflow-style:none;"></div>
                <div class="tumbler-overlay-top" style="position:absolute; top:0; left:0; right:0; height:5px; background:linear-gradient(to bottom, var(--bg-primary) 10%, rgba(18,18,16,0) 100%); pointer-events:none;"></div>
                <div class="tumbler-overlay-bottom" style="position:absolute; bottom:0; left:0; right:0; height:5px; background:linear-gradient(to top, var(--bg-primary) 10%, rgba(18,18,16,0) 100%); pointer-events:none;"></div>
              </div>
              <input type="hidden" id="zoom-input-recurrence-day" value="Every Sunday">
            </div>
            <div style="display:flex; flex-direction:column; gap:6px;">
              <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Time</label>
              <input type="text" id="zoom-input-recurrence-time" placeholder="e.g. 7:00 PM" style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background-color:var(--bg-primary);">
            </div>
          </div>
          <div style="display:flex; flex-direction:column; gap:6px;">
            <label style="font-size:12px; font-weight:600; color:var(--text-secondary);">Zoom Link (Optional)</label>
            <input type="text" id="zoom-input-link" placeholder="https://zoom.us/j/..." style="padding:10px 14px; border:1px solid var(--border-color); border-radius:8px; background-color:var(--bg-primary);">
            <span style="font-size:11px; color:var(--text-muted);">Leave empty to auto-generate a secure room link.</span>
          </div>
          <button class="btn btn-primary" id="zoom-save-btn" style="margin-top:8px; width:100%;">Create Room</button>

          <!-- Custom Circle Watch Popover -->
          <div id="zoom-clock-picker-popover" style="display:none; position:absolute; z-index:200; background-color:var(--bg-secondary); border:1px solid var(--border-color); border-radius:12px; box-shadow:0 12px 30px rgba(0,0,0,0.25); padding:16px; width:220px; flex-direction:column; align-items:center; gap:12px; user-select:none; box-sizing:border-box;">
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
              <span id="zoom-clock-title" style="font-size:12px; font-weight:700; color:var(--accent-color);">Select Time</span>
            </div>
            
            <div id="zoom-clock-svg-container" style="position:relative; width:170px; height:170px;">
              <svg id="zoom-clock-svg" width="170" height="170" style="cursor:pointer; display:block; overflow:visible;">
                <!-- Clock face circle -->
                <circle cx="85" cy="85" r="80" fill="var(--bg-primary)" stroke="var(--border-color)" stroke-width="1"/>
                <!-- Concentric inner ring guide -->
                <circle cx="85" cy="85" r="48" fill="none" stroke="rgba(255,255,255,0.04)" stroke-width="1" stroke-dasharray="2,2"/>
                <!-- Center point -->
                <circle cx="85" cy="85" r="4" fill="var(--accent-color)"/>
                <!-- Dial hand -->
                <line id="zoom-clock-hand" x1="85" y1="85" x2="85" y2="25" stroke="var(--accent-color)" stroke-width="3" stroke-linecap="round"/>
                <!-- Dial selector dot -->
                <circle id="zoom-clock-hand-dot" cx="85" cy="25" r="6" fill="var(--accent-color)"/>
                
                <!-- SVG Text containers for numbers (populated via JS) -->
                <g id="zoom-clock-numbers" fill="var(--text-secondary)" font-size="10" font-weight="700" text-anchor="middle" dominant-baseline="central"></g>
              </svg>
            </div>
            
            <div style="display:flex; justify-content:space-between; width:100%; align-items:center;">
              <div style="display:flex; gap:8px;">
                <button type="button" id="zoom-clock-mode-hour" class="btn btn-secondary active" style="padding:4px 8px; font-size:11px; font-weight:700; border:none; background-color:var(--accent-color); color:var(--accent-text);">Hour</button>
                <button type="button" id="zoom-clock-mode-minute" class="btn btn-secondary" style="padding:4px 8px; font-size:11px; font-weight:700; border:1px solid var(--border-color); background-color:transparent; color:var(--text-muted);">Minute</button>
              </div>
              <span id="zoom-clock-display" style="font-size:14px; font-weight:700; color:var(--text-primary);">07:00 AM</span>
            </div>
          </div>
        </div>
      </div>
    `
  };

  function injectTemplates() {
    document.getElementById('search-drawer-overlay').innerHTML = TEMPLATES.searchDrawer;
    document.getElementById('book-select-modal').innerHTML = TEMPLATES.bookSelect;
    document.getElementById('chapter-select-modal').innerHTML = TEMPLATES.chapterSelect;
    document.getElementById('version-select-modal').innerHTML = TEMPLATES.versionSelect;
    document.getElementById('font-config-modal').innerHTML = TEMPLATES.fontConfig;
    document.getElementById('floating-verse-actionbar').innerHTML = TEMPLATES.floatingActionBar;
    document.getElementById('add-note-modal').innerHTML = TEMPLATES.addNote;
    document.getElementById('plan-detail-modal').innerHTML = TEMPLATES.planDetail;
    document.getElementById('plan-session-modal').innerHTML = TEMPLATES.planSession;
    document.getElementById('share-card-modal').innerHTML = TEMPLATES.shareCard;
    document.getElementById('create-plan-modal').innerHTML = TEMPLATES.createPlan;
    document.getElementById('zoom-create-modal').innerHTML = TEMPLATES.zoomCreate;

    // Centralized Modal Observer to handle body scroll lock and pointer events
    const modalObserver = new MutationObserver(() => {
      const anyModalOpen = Array.from(document.querySelectorAll('.modal')).some(
        m => m.style.display === 'flex' || m.style.display === 'block'
      );
      if (anyModalOpen) {
        document.body.classList.add('modal-open');
        document.documentElement.classList.add('modal-open');
      } else {
        document.body.classList.remove('modal-open');
        document.documentElement.classList.remove('modal-open');
      }
    });

    document.querySelectorAll('.modal').forEach(modal => {
      modalObserver.observe(modal, { attributes: true, attributeFilter: ['style'] });
    });
  }

  function renderNavigation() {
    const sidebarNav = document.getElementById('sidebar-nav-container');
    const bottomNav = document.getElementById('bottom-nav-container');
    
    if (sidebarNav) {
      sidebarNav.innerHTML = window.BIBLE_DATA.navigationItems.map(item => `
        <div class="nav-link" data-target="${item.target}">
          ${item.iconHtml}
          <span>${item.target}</span>
        </div>
      `).join('');
    }
    
    if (bottomNav) {
      bottomNav.innerHTML = window.BIBLE_DATA.navigationItems.map(item => `
        <div class="bottom-link" data-target="${item.target}">
          ${item.iconHtml}
          <span>${item.target}</span>
        </div>
      `).join('');
    }
  }

  function renderQuickTools() {
    const container = document.querySelector('.quick-actions');
    if (container) {
      container.innerHTML = window.BIBLE_DATA.quickTools.map(tool => `
        <div class="quick-action-btn" data-action="${tool.action}">
          ${tool.iconHtml}
          <span id="${tool.id}"></span>
        </div>
      `).join('');
    }
  }

  function renderDailyDevotionalCardStructure() {
    const container = document.getElementById('daily-devo-card');
    if (container) {
      container.innerHTML = `
        <div class="card-title-row">
          <span class="card-tag" id="home-devo-tag"></span>
          <span style="font-size: 12px; font-weight:600; color:var(--text-muted);" id="home-devo-date"></span>
        </div>
        <h3 style="margin-bottom: 8px;" id="home-devo-title"></h3>
        <p style="color: var(--text-secondary); margin-bottom: 20px; font-size:14px;" id="home-devo-excerpt"></p>
        
        <!-- Devotional Audio Narration Player -->
        <div class="devo-audio-player" style="display: flex; align-items: center; gap: 12px; margin-bottom: 20px; padding: 12px 16px; border-radius: 12px; background-color: var(--bg-primary); border: 1px solid var(--border-color);">
          <button class="btn btn-secondary btn-icon-only" id="devo-audio-play-btn" style="width:36px; height:36px; display:flex; justify-content:center; align-items:center; flex-shrink:0;" title="Play Devotional Audio">
            <svg viewBox="0 0 24 24" width="16" height="16" id="devo-play-icon" fill="currentColor" style="display:block;"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
            <svg viewBox="0 0 24 24" width="16" height="16" id="devo-pause-icon" fill="currentColor" style="display:none;"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>
          </button>
          
          <div style="flex-grow: 1; display: flex; flex-direction: column; gap: 4px; min-width: 0;">
            <div style="display: flex; justify-content: space-between; font-size: 10px; color: var(--text-muted); font-weight:700;">
              <span>AI Audio Companion</span>
              <span id="devo-audio-time">0:00 / 1:30</span>
            </div>
            <div class="progress-track" id="devo-audio-progress-track" style="height: 6px; background-color: var(--bg-secondary); border-radius: 3px; cursor: pointer; position: relative;">
              <div class="progress-fill" id="devo-audio-progress-fill" style="width: 0%; height: 100%; background-color: var(--accent-color); border-radius: 3px; transition: width 0.1s linear;"></div>
            </div>
          </div>
        </div>
        
        <button class="btn btn-secondary" style="width: fit-content;" id="home-devo-start-btn"></button>
      `;
    }
  }

  function renderZoomOptions() {
    const durationWheel = document.getElementById('zoom-duration-tumbler-wheel');
    const recurrenceWheel = document.getElementById('zoom-tumbler-wheel');
    const lang = state.settings.systemLanguage || 'en';
    
    if (durationWheel) {
      durationWheel.innerHTML = `
        <div class="tumbler-spacer" style="height:38px;"></div>
        ${window.BIBLE_DATA.zoomDurations.map(d => `
          <div class="tumbler-item" data-value="${d.value}" style="height:34px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:500; color:var(--text-muted); scroll-snap-align:center;">
            ${d.label[lang]}
          </div>
        `).join('')}
        <div class="tumbler-spacer" style="height:38px;"></div>
      `;
    }
    
    if (recurrenceWheel) {
      recurrenceWheel.innerHTML = `
        <div class="tumbler-spacer" style="height:38px;"></div>
        ${window.BIBLE_DATA.zoomRecurrences.map(r => `
          <div class="tumbler-item" data-value="${r.value}" style="height:34px; display:flex; align-items:center; justify-content:center; font-size:13px; font-weight:500; color:var(--text-muted); scroll-snap-align:center;">
            ${r.label[lang]}
          </div>
        `).join('')}
        <div class="tumbler-spacer" style="height:38px;"></div>
      `;
    }
  }

  function renderPlanCategories() {
    const container = document.querySelector('.plan-category-tags');
    if (container) {
      const lang = state.settings.systemLanguage || 'en';
      container.innerHTML = window.BIBLE_DATA.planCategories.map((cat, idx) => `
        <div class="category-tag ${idx === 0 ? 'active' : ''}" data-category="${cat.id}">
          ${cat.name[lang]}
        </div>
      `).join('');
      
      // Bind click events after rendering
      document.querySelectorAll('.plan-category-tags .category-tag').forEach(tag => {
        tag.addEventListener('click', () => {
          document.querySelectorAll('.plan-category-tags .category-tag').forEach(t => t.classList.remove('active'));
          tag.classList.add('active');
          renderPlansView();
        });
      });
    }
  }

  // Inject templates and build dynamic components
  injectTemplates();
  renderNavigation();
  renderQuickTools();
  renderDailyDevotionalCardStructure();
  renderZoomOptions();
  renderPlanCategories();

  // --- 2. GLOBAL ELEMENTS & Caching ---
  const elements = {
    // Nav Links
    navLinks: document.querySelectorAll('.nav-link, .bottom-link'),
    sections: document.querySelectorAll('.view-section'),
    viewTitle: document.getElementById('current-view-title'),
    
    // Header Actions
    themeToggleBtn: document.getElementById('theme-toggle-btn'),
    settingsTriggerBtn: document.getElementById('settings-trigger-btn'),
    searchTriggerBtn: document.getElementById('search-trigger-btn'),
    
    // Header Search
    headerSearchInput: document.getElementById('header-search-input'),
    headerSearchResults: document.getElementById('header-search-results'),
    
    // Search Drawer
    searchDrawer: document.getElementById('search-drawer-overlay'),
    searchCloseBtn: document.getElementById('search-drawer-close'),
    searchInput: document.getElementById('search-keyword-input'),
    searchResults: document.getElementById('search-results-list'),
    
    // Bible Reader Controls
    readerBookBtn: document.getElementById('reader-book-btn'),
    readerChapterBtn: document.getElementById('reader-chapter-btn'),
    readerVersionBtn: document.getElementById('reader-version-btn'),
    readerLangBtn: document.getElementById('reader-lang-btn'),
    readerFontBtn: document.getElementById('reader-font-btn'),
    readerAudioBtn: document.getElementById('reader-audio-btn'),
    bibleTextDisplay: document.getElementById('bible-text-display'),
    prevChapterBtn: document.getElementById('reader-prev-chapter'),
    nextChapterBtn: document.getElementById('reader-next-chapter'),
    floatingVerseActionbar: document.getElementById('floating-verse-actionbar'),
    
    // Modals & Drawers
    bookSelectModal: document.getElementById('book-select-modal'),
    chapterSelectModal: document.getElementById('chapter-select-modal'),
    versionSelectModal: document.getElementById('version-select-modal'),
    fontConfigModal: document.getElementById('font-config-modal'),
    addNoteModal: document.getElementById('add-note-modal'),
    planDetailModal: document.getElementById('plan-detail-modal'),
    planSessionModal: document.getElementById('plan-session-modal'),
    shareCardModal: document.getElementById('share-card-modal'),
    createPlanModal: document.getElementById('create-plan-modal'),
    zoomCreateModal: document.getElementById('zoom-create-modal'),
    
    // Settings panel
    darkModeCheckbox: document.getElementById('settings-darkmode-checkbox'),
    notificationsCheckbox: document.getElementById('settings-notifications-checkbox'),
    offlineCheckbox: document.getElementById('settings-offline-checkbox'),
    systemLangSelect: document.getElementById('settings-system-lang'),
    bibleVersionSelect: document.getElementById('settings-bible-version'),
    clearCacheBtn: document.getElementById('clear-cache-btn'),
    
    // Audio Player Elements
    audioPlayerBar: document.getElementById('audio-playback-player'),
    audioTrackTitle: document.getElementById('audio-track-title'),
    audioTrackSubtitle: document.getElementById('audio-track-subtitle'),
    audioBtnSpeed: document.getElementById('audio-btn-speed'),
    audioBtnPlay: document.getElementById('audio-btn-play'),
    audioBtnPrev: document.getElementById('audio-btn-prev'),
    audioBtnNext: document.getElementById('audio-btn-next'),
    audioBtnClose: document.getElementById('audio-btn-close'),
    audioTimeCurrent: document.getElementById('audio-time-current'),
    audioTimeDuration: document.getElementById('audio-time-duration'),
    audioProgressTrack: document.getElementById('audio-track-progress'),
    audioProgressFill: document.getElementById('audio-track-fill'),
    playSvg: document.getElementById('play-svg'),
    pauseSvg: document.getElementById('pause-svg'),
    
    // Toast Container
    toastContainer: document.getElementById('toast-container')
  };

  // --- 3. SPA ROUTER ---
  function navigateTo(targetView) {
    elements.sections.forEach(sec => {
      sec.classList.remove('active-view');
    });
    
    const targetSec = document.getElementById(`${targetView}-view`);
    if (targetSec) {
      targetSec.classList.add('active-view');
      
      // Auto-close sidebar on mobile after navigating
      if (window.innerWidth <= 768) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) sidebar.style.transform = 'translateX(-100%)';
      }
      
      // Clear verse highlights/action bar when leaving the bible reader
      if (targetView !== 'bible') {
        clearVerseSelection();
      }
      
      // Update Title based on system language
      const lang = state.settings.systemLanguage || 'en';
      const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];
      
      let title = '';
      if (targetView === 'home') title = dict.navHome;
      else if (targetView === 'bible') title = dict.navBible;
      else if (targetView === 'plans') title = dict.navPlans;
      else if (targetView === 'sermons') title = dict.navSermons;
      else if (targetView === 'prayer') title = dict.navPrayer;
      else if (targetView === 'community') title = dict.navCommunity;
      else if (targetView === 'meetings') title = dict.navMeetings;
      else if (targetView === 'saved') title = dict.navSaved;
      else if (targetView === 'settings') title = dict.settingsTitle;
      else title = targetView.charAt(0).toUpperCase() + targetView.slice(1);
      
      elements.viewTitle.textContent = title;
      
      // Update Navigation styling
      elements.navLinks.forEach(link => {
        if (link.getAttribute('data-target') === targetView) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
      
      // Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Run view-specific render functions
      if (targetView === 'home') renderHomeView();
      if (targetView === 'bible') renderBibleReader();
      if (targetView === 'plans') renderPlansView();
      if (targetView === 'sermons') renderSermonsView();
      if (targetView === 'prayer') renderPrayerView();
      if (targetView === 'community') renderCommunityView();
      if (targetView === 'meetings') renderMeetingsView();
      if (targetView === 'saved') renderSavedView();
      if (targetView === 'profile') renderProfileView();
    }
  }

  // Bind Router Events
  elements.navLinks.forEach(link => {
    link.addEventListener('click', () => {
      const target = link.getAttribute('data-target');
      navigateTo(target);
    });
  });

  // Desktop Sidebar Toggle (Collapse / Expand)
  const sidebarCollapseBtn = document.getElementById('sidebar-collapse-btn');
  const appContainer = document.getElementById('app');

  if (sidebarCollapseBtn) {
    sidebarCollapseBtn.addEventListener('click', () => {
      if (appContainer) {
        appContainer.classList.add('sidebar-collapsed');
      }
    });
  }

  // Pill Toolbar Event Listener (Opener only)
  const pillSidebarToggle = document.getElementById('pill-sidebar-toggle');

  if (pillSidebarToggle) {
    pillSidebarToggle.addEventListener('click', () => {
      if (appContainer) {
        appContainer.classList.toggle('sidebar-collapsed');
      }
    });
  }

  // Mobile Top Hamburger Drawer Menu Trigger & Close on outside click
  const sidebarEl = document.querySelector('.sidebar');
  const mobileMenuOpenBtn = document.getElementById('mobile-menu-open');
  
  if (mobileMenuOpenBtn) {
    mobileMenuOpenBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (sidebarEl) {
        sidebarEl.style.transform = (sidebarEl.style.transform === 'translateX(0px)') ? 'translateX(-100%)' : 'translateX(0px)';
      }
    });
  }

  // Close sidebar drawer when clicking outside it on mobile
  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && sidebarEl && sidebarEl.style.transform === 'translateX(0px)') {
      if (!sidebarEl.contains(e.target) && (!mobileMenuOpenBtn || !mobileMenuOpenBtn.contains(e.target))) {
        sidebarEl.style.transform = 'translateX(-100%)';
      }
    }
  });

  // Sidebar profile card redirect
  document.getElementById('sidebar-profile-trigger').addEventListener('click', () => {
    navigateTo('profile');
  });

  document.getElementById('header-streak-badge').addEventListener('click', () => {
    navigateTo('profile');
  });

  // --- 4. TOAST NOTIFICATIONS ---
  const TOAST_TRANSLATIONS = {
    vi: {
      'Dark mode enabled': 'Đã bật chế độ tối',
      'Light mode enabled': 'Đã bật chế độ sáng',
      'System language changed': 'Đã đổi ngôn ngữ hệ thống',
      'Highlight removed': 'Đã xóa đánh dấu',
      'Scripture highlighted': 'Đã đánh dấu câu Kinh Thánh',
      'Verse bookmarked successfully': 'Đã đánh dấu câu Kinh Thánh thành công',
      'Study note saved & shared': 'Đã lưu và chia sẻ ghi chú học tập',
      'Verse reference copied to clipboard': 'Đã sao chép địa chỉ Kinh Thánh vào bộ nhớ đệm',
      'Please start the reading plan first.': 'Vui lòng bắt đầu kế hoạch đọc trước.',
      'Prayer request logged.': 'Đã ghi lại yêu cầu cầu nguyện.',
      'Praise God! Mark as Answered Prayer.': 'Tạ ơn Chúa! Đã đánh dấu lời cầu nguyện được nhậm.',
      'Prayer entry deleted': 'Đã xóa yêu cầu cầu nguyện',
      'Comment posted.': 'Đã gửi bình luận.',
      'Saved item removed': 'Đã xóa mục đã lưu',
      'Profile information saved.': 'Đã lưu thông tin hồ sơ.',
      'Daily notifications enabled': 'Đã bật thông báo hàng ngày',
      'Notifications disabled': 'Đã tắt thông báo',
      'Verse of the day bookmarked.': 'Đã lưu câu Kinh Thánh trong ngày.',
      'Please fill out all required fields': 'Vui lòng điền đầy đủ các thông tin bắt buộc',
      'Zoom fellowship room scheduled!': 'Đã lên lịch phòng thông công Zoom!'
    }
  };

  function translateMessage(msg, lang) {
    if (lang !== 'vi') return msg;
    if (TOAST_TRANSLATIONS.vi[msg]) {
      return TOAST_TRANSLATIONS.vi[msg];
    }
    if (msg.startsWith('Switched translation to ')) {
      return `Đã chuyển sang bản dịch ${msg.replace('Switched translation to ', '')}`;
    }
    if (msg.startsWith('Bible translation set to ')) {
      return `Đã thiết lập bản dịch Kinh Thánh thành ${msg.replace('Bible translation set to ', '')}`;
    }
    if (msg.startsWith('Started plan: ')) {
      return `Đã bắt đầu kế hoạch: ${msg.replace('Started plan: ', '')}`;
    }
    if (msg.includes('Congratulations! You completed "')) {
      const planTitle = msg.substring(msg.indexOf('"') + 1, msg.lastIndexOf('"'));
      return `🎉 Chúc mừng! Bạn đã hoàn thành kế hoạch "${planTitle}"!`;
    }
    if (msg.endsWith(' completed! Keep going!')) {
      const day = msg.replace(' completed! Keep going!', '');
      return `${day} đã hoàn thành! Tiếp tục cố gắng nhé!`;
    }
    if (msg.startsWith('Added friend: ')) {
      return `Đã thêm bạn: ${msg.replace('Added friend: ', '')}`;
    }
    return msg;
  }

  function showToast(message, type = 'success') {
    const lang = (state && state.settings && state.settings.systemLanguage) || 'en';
    const translatedMsg = translateMessage(message, lang);
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
      <svg viewBox="0 0 24 24" width="18" height="18" stroke="currentColor" fill="none" stroke-width="2">
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
      <span>${translatedMsg}</span>
    `;
    elements.toastContainer.appendChild(toast);
    
    // Auto-dismiss
    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 350);
    }, 3000);
  }


  // --- 5. THEME SYSTEM ---
  function applyTheme() {
    if (state.settings.darkMode) {
      document.body.setAttribute('data-theme', 'dark');
      elements.themeToggleBtn.innerHTML = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;
      elements.darkModeCheckbox.checked = true;
    } else {
      document.body.removeAttribute('data-theme');
      elements.themeToggleBtn.innerHTML = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
      elements.darkModeCheckbox.checked = false;
    }
  }

  elements.themeToggleBtn.addEventListener('click', () => {
    state.settings.darkMode = !state.settings.darkMode;
    saveState();
    applyTheme();
    showToast(state.settings.darkMode ? 'Dark mode enabled' : 'Light mode enabled');
  });

  elements.darkModeCheckbox.addEventListener('change', (e) => {
    state.settings.darkMode = e.target.checked;
    saveState();
    applyTheme();
  });

  // Clear Cache Button
  elements.clearCacheBtn.addEventListener('click', () => {
    if (confirm('Are you sure you want to reset all user data? This will clear bookmarks, streaks, notes, and plan progress.')) {
      localStorage.removeItem('aurabible_state');
      state = { ...DEFAULT_STATE };
      saveState();
      location.reload();
    }
  });

  // --- 5.5 LANGUAGE SYSTEM ---
  function applyLanguage() {
    const lang = state.settings.systemLanguage || 'en';
    const dict = UI_TRANSLATIONS[lang] || UI_TRANSLATIONS['en'];

    // Update navigation sidebar/footer links
    const updateNavLink = (target, text) => {
      const elList = document.querySelectorAll(`.nav-link[data-target="${target}"] span, .bottom-link[data-target="${target}"] span`);
      elList.forEach(el => el.textContent = text);
    };
    updateNavLink('home', dict.navHome);
    updateNavLink('bible', dict.navBible);
    updateNavLink('plans', dict.navPlans);
    updateNavLink('sermons', dict.navSermons);
    updateNavLink('prayer', dict.navPrayer);
    updateNavLink('community', dict.navCommunity);
    updateNavLink('meetings', dict.navMeetings);
    updateNavLink('saved', dict.navSaved);

    // Update Settings UI texts
    const settingsHeader = document.getElementById('settings-title-label');
    if (settingsHeader) settingsHeader.textContent = dict.settingsTitle;

    const setLabelText = (id, text) => {
      const el = document.getElementById(id);
      if (el) el.textContent = text;
    };
    setLabelText('settings-darkmode-title', dict.settingsDarkMode);
    setLabelText('settings-darkmode-desc', dict.settingsDarkModeDesc);
    setLabelText('settings-reminders-title', dict.settingsDailyReminders);
    setLabelText('settings-reminders-desc', dict.settingsDailyRemindersDesc);
    setLabelText('settings-offline-title', dict.settingsOffline);
    setLabelText('settings-offline-desc', dict.settingsOfflineDesc);
    setLabelText('settings-syslang-title', dict.settingsSysLang);
    setLabelText('settings-syslang-desc', dict.settingsSysLangDesc);
    setLabelText('settings-biblever-title', dict.settingsBibleVer);
    setLabelText('settings-biblever-desc', dict.settingsBibleVerDesc);
    setLabelText('settings-clear-title', dict.settingsClear);
    setLabelText('settings-clear-desc', dict.settingsClearDesc);
    
    // Update Home View elements
    setLabelText('home-votd-tag', dict.homeVotdTag);
    setLabelText('home-votd-btn-text', dict.homeVotdBtnText);
    setLabelText('home-devo-tag', dict.homeDevoTag);
    setLabelText('home-devo-date', dict.homeDevoDate);
    setLabelText('home-devo-title', dict.homeDevoTitle);
    setLabelText('home-devo-excerpt', dict.homeDevoExcerpt);
    setLabelText('home-devo-start-btn', dict.homeDevoBtn);
    setLabelText('home-plans-title', dict.homePlansTitle);
    setLabelText('home-active-tag', dict.homeActiveTag);
    setLabelText('home-active-plan-continue', dict.homeActiveContinueText);
    setLabelText('home-quick-title', dict.homeQuickTitle);
    setLabelText('quick-reader', dict.quickReader);
    setLabelText('quick-prayer', dict.quickPrayer);
    setLabelText('quick-saved', dict.quickSaved);
    setLabelText('quick-plans', dict.quickPlans);
    setLabelText('sidebar-user-streak-text', dict.sidebarStreakText);

    // Update Modal Titles & Sliders & Tabs
    setLabelText('modal-select-book-title', dict.modalSelectBook);
    setLabelText('modal-select-chapter-title', dict.modalSelectChapter);
    setLabelText('modal-select-version-title', dict.modalSelectVersion);
    setLabelText('modal-reading-settings-title', dict.modalReadingSettings);
    setLabelText('modal-add-note-title', dict.modalAddNote);
    setLabelText('modal-share-card-title', dict.modalShareCard);
    setLabelText('modal-schedule-room-title', dict.modalScheduleRoom);
    setLabelText('settings-text-size-label', dict.settingsTextSize);
    setLabelText('settings-line-spacing-label', dict.settingsLineSpacing);
    setLabelText('settings-layout-label', dict.settingsVerseLayout);
    setLabelText('opt-layout-paragraph', dict.settingsLayoutParagraph);
    setLabelText('opt-layout-verse', dict.settingsLayoutVerse);
    setLabelText('btn-tab-ot', dict.btnTabOt);
    setLabelText('btn-tab-nt', dict.btnTabNt);
    setLabelText('btn-session-devo', dict.sessionTabDevo);
    setLabelText('btn-session-scripture', dict.sessionTabScripture);
    setLabelText('btn-session-reflect', dict.sessionTabReflect);
    setLabelText('session-prev-tab-btn', dict.sessionPrevBtn);
    setLabelText('session-action-btn', dict.sessionNextBtn);
    setLabelText('plan-detail-days-title', dict.planDetailDaysTitle);
    setLabelText('plan-detail-save-btn', dict.planDetailSaveBtn);

    // Custom Plan Creator Mappings
    setLabelText('plans-header-title', dict.plansHeaderTitle);
    setLabelText('label-create-plan-btn', dict.labelCreatePlanBtn);
    setLabelText('create-plan-modal-title', dict.createPlanModalTitle);
    setLabelText('create-plan-title-label', dict.createPlanTitleLabel);
    setLabelText('create-plan-category-label', dict.createPlanCategoryLabel);
    setLabelText('create-plan-desc-label', dict.createPlanDescLabel);
    setLabelText('create-plan-days-label', dict.createPlanDaysLabel);
    setLabelText('create-plan-btn-add-day', dict.createPlanAddDayBtn);
    setLabelText('create-plan-btn-save', dict.createPlanSaveBtn);

    // Mappings for Prayer, Community, Meetings, and Saved views
    setLabelText('filter-prayers-all', dict.filterPrayersAll);
    setLabelText('filter-prayers-answered', dict.filterPrayersAnswered);
    setLabelText('filter-meetings-all', dict.filterMeetingsAll);
    setLabelText('filter-meetings-live', dict.filterMeetingsLive);
    setLabelText('meetings-banner-tag', dict.meetingsBannerTag);
    setLabelText('meetings-banner-header', dict.meetingsBannerHeader);
    setLabelText('meetings-banner-text', dict.meetingsBannerText);
    setLabelText('meetings-schedule-btn-text', dict.meetingsScheduleBtnText);
    setLabelText('meetings-active-header', dict.meetingsActiveHeader);
    setLabelText('community-feed-header', dict.communityFeedHeader);
    setLabelText('community-friends-header', dict.communityFriendsHeader);
    setLabelText('saved-tab-highlights', dict.savedTabHighlights);
    setLabelText('saved-tab-bookmarks', dict.savedTabBookmarks);
    setLabelText('saved-tab-notes', dict.savedTabNotes);
    setLabelText('prayer-composer-header', dict.prayerComposerHeader);
    setLabelText('prayer-share-label', dict.prayerShareLabel);
    setLabelText('prayer-journal-header', dict.prayerJournalHeader);
    setLabelText('prayer-sidebar-header', dict.prayerSidebarHeader);
    setLabelText('prayer-sidebar-text', dict.prayerSidebarText);
    setLabelText('prayer-submit-btn', dict.prayerSubmitBtn);
    setLabelText('reader-prev-chapter', dict.readerPrevChapter);
    setLabelText('reader-next-chapter', dict.readerNextChapter);
    setLabelText('share-card-style-label', dict.shareCardStyleLabel);
    setLabelText('share-card-bg-label', dict.shareCardBgLabel);
    setLabelText('sermons-composer-header', dict.sermonsComposerHeader);
    setLabelText('sermons-list-header', dict.sermonsListHeader);
    setLabelText('sermons-sidebar-header', dict.sermonsSidebarHeader);
    setLabelText('sermons-sidebar-text', dict.sermonsSidebarText);
    setLabelText('sermon-submit-btn', dict.sermonsSubmitBtn);

    const searchInputs = [document.getElementById('header-search-input'), document.getElementById('search-keyword-input')];
    searchInputs.forEach(input => {
      if (input) {
        input.placeholder = dict.searchPlaceholder || "Search references, keywords, plans...";
      }
    });

    const prayerInput = document.getElementById('prayer-input');
    if (prayerInput) {
      prayerInput.placeholder = lang === 'vi' ? 'Nhập yêu cầu cầu nguyện của bạn tại đây...' : 'Type your prayer request here...';
    }
    const addFriendBtn = document.getElementById('add-friend-btn');
    if (addFriendBtn) {
      addFriendBtn.textContent = lang === 'vi' ? '+ Thêm' : '+ Add';
    }

    // Refresh dynamic lists to reflect language switch immediately
    if (document.getElementById('prayer-view').classList.contains('active-view')) renderPrayerView();
    if (document.getElementById('community-view').classList.contains('active-view')) renderCommunityView();
    if (document.getElementById('saved-view').classList.contains('active-view')) renderSavedView();
    if (document.getElementById('meetings-view').classList.contains('active-view')) renderMeetingsView();
    if (document.getElementById('sermons-view').classList.contains('active-view')) renderSermonsView();

    // Update streak tooltip in header
    const headerStreakBadge = document.getElementById('header-streak-badge');
    if (headerStreakBadge) {
      headerStreakBadge.setAttribute('title', lang === 'vi' ? 'Chuỗi đọc Kinh Thánh hàng ngày' : 'Daily Momentum Streak');
    }
    
    if (elements.clearCacheBtn) elements.clearCacheBtn.textContent = dict.settingsResetBtn;

    // Synchronize selector input values and checkboxes
    if (elements.systemLangSelect) elements.systemLangSelect.value = lang;
    if (elements.bibleVersionSelect) elements.bibleVersionSelect.value = state.readerState.translation;
    if (elements.darkModeCheckbox) elements.darkModeCheckbox.checked = !!state.settings.darkMode;
    if (elements.notificationsCheckbox) elements.notificationsCheckbox.checked = !!state.settings.notifications;
    if (elements.offlineCheckbox) elements.offlineCheckbox.checked = !!state.settings.offline;
    const offlineIndicator = document.getElementById('offline-status-indicator');
    if (offlineIndicator) {
      offlineIndicator.style.display = state.settings.offline ? 'inline' : 'none';
      offlineIndicator.textContent = lang === 'vi' ? '✓ Khả dụng ngoại tuyến' : '✓ Available Offline';
    }

    // Update current active view title (if active settings, update title)
    const activeSection = document.querySelector('.view-section.active-view');
    if (activeSection) {
      const activeView = activeSection.id.replace('-view', '');
      let title = '';
      if (activeView === 'home') title = dict.navHome;
      else if (activeView === 'bible') title = dict.navBible;
      else if (activeView === 'plans') title = dict.navPlans;
      else if (activeView === 'sermons') title = dict.navSermons;
      else if (activeView === 'prayer') title = dict.navPrayer;
      else if (activeView === 'community') title = dict.navCommunity;
      else if (activeView === 'meetings') title = dict.navMeetings;
      else if (activeView === 'saved') title = dict.navSaved;
      else if (activeView === 'settings') title = dict.settingsTitle;
      else title = activeView.charAt(0).toUpperCase() + activeView.slice(1);
      
      elements.viewTitle.textContent = title;
    }
    renderHomeView();
    renderPlansView();
  }

  // Bind change listeners to settings dropdown selectors
  if (elements.systemLangSelect) {
    elements.systemLangSelect.addEventListener('change', (e) => {
      state.settings.systemLanguage = e.target.value;
      saveState();
      applyLanguage();
      renderBibleReader();
      showToast(state.settings.systemLanguage === 'vi' ? 'Đã đổi ngôn ngữ hệ thống' : 'System language changed');
    });
  }

  if (elements.bibleVersionSelect) {
    elements.bibleVersionSelect.addEventListener('change', (e) => {
      state.readerState.translation = e.target.value;
      saveState();
      renderBibleReader();
      showToast(`Bible translation set to ${e.target.value}`);
    });
  }

  // --- 6. GLOBAL SEARCH ENGINE ---
  if (elements.searchTriggerBtn) {
    elements.searchTriggerBtn.addEventListener('click', () => {
      if (elements.searchDrawer) elements.searchDrawer.classList.add('open');
      if (elements.searchInput) elements.searchInput.focus();
    });
  }

  if (elements.searchCloseBtn) {
    elements.searchCloseBtn.addEventListener('click', () => {
      if (elements.searchDrawer) elements.searchDrawer.classList.remove('open');
    });
  }

  // Header Search Engine
  function closeHeaderSearch() {
    if (elements.headerSearchResults) {
      elements.headerSearchResults.style.display = 'none';
      elements.headerSearchResults.innerHTML = '';
    }
  }

  if (elements.headerSearchInput) {
    elements.headerSearchInput.addEventListener('input', () => {
      const q = elements.headerSearchInput.value.toLowerCase().trim();
      if (!q) {
        closeHeaderSearch();
        return;
      }

      let resultsHTML = '';
      const isVi = state.settings.systemLanguage === 'vi';
      
      // A. Search Scriptures static index
      let bibleMatches = [];
      const db = window.BIBLE_DATA.staticScriptures.WEB; // Default index
      Object.keys(db).forEach(bookId => {
        Object.keys(db[bookId]).forEach(chap => {
          db[bookId][chap].forEach(v => {
            if (v.text.toLowerCase().includes(q)) {
              bibleMatches.push({
                title: `${getBookName(bookId)} ${chap}:${v.num}`,
                text: v.text,
                action: `view-bible:${bookId}:${chap}`
              });
            }
          });
        });
      });

      if (bibleMatches.length > 0) {
        resultsHTML += `
          <div class="search-result-group">
            <div class="group-title">${isVi ? 'Câu Kinh Thánh' : 'Bible Verses'} (${bibleMatches.length})</div>
            ${bibleMatches.slice(0, 4).map(m => `
              <div class="result-item" onclick="window.AURA_APP.jumpToRef('${m.action}'); document.getElementById('header-search-results').style.display='none';">
                <div class="result-title">${m.title}</div>
                <div class="result-text">${m.text}</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      // B. Search Plans
      let planMatches = getAllPlans().filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
      if (planMatches.length > 0) {
        resultsHTML += `
          <div class="search-result-group">
            <div class="group-title">${isVi ? 'Kế hoạch đọc' : 'Reading Plans'}</div>
            ${planMatches.slice(0, 3).map(p => `
              <div class="result-item" onclick="window.AURA_APP.showPlanDetails('${p.id}'); document.getElementById('header-search-results').style.display='none';">
                <div class="result-title">${p.title}</div>
                <div class="result-text">${p.description}</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      // C. Search Notes
      let noteMatches = state.saved.notes.filter(n => n.noteText.toLowerCase().includes(q) || n.text.toLowerCase().includes(q));
      if (noteMatches.length > 0) {
        resultsHTML += `
          <div class="search-result-group">
            <div class="group-title">${isVi ? 'Ghi chú học tập' : 'Study Notes'}</div>
            ${noteMatches.slice(0, 3).map(n => `
              <div class="result-item" onclick="window.AURA_APP.jumpToRef('view-bible:${n.bookId}:${n.chapter}'); document.getElementById('header-search-results').style.display='none';">
                <div class="result-title">${n.bookId} ${n.chapter}:${n.verseNum}</div>
                <div class="result-text">${n.noteText}</div>
              </div>
            `).join('')}
          </div>
        `;
      }

      if (resultsHTML) {
        elements.headerSearchResults.innerHTML = resultsHTML;
        elements.headerSearchResults.style.display = 'block';
      } else {
        elements.headerSearchResults.innerHTML = `<div style="text-align:center; padding:12px; font-size:12px; color:var(--text-muted);">${isVi ? 'Không tìm thấy kết quả' : 'No results found'}</div>`;
        elements.headerSearchResults.style.display = 'block';
      }
    });

    // Close dropdown on click outside
    document.addEventListener('click', (e) => {
      if (elements.headerSearchResults && !elements.headerSearchInput.contains(e.target) && !elements.headerSearchResults.contains(e.target)) {
        closeHeaderSearch();
      }
    });
  }

  // --- 7. HOME VIEW RENDER ---
  function renderHomeView() {
    // Profile Sync
    document.getElementById('sidebar-user-avatar').src = state.profile.avatar;
    document.getElementById('sidebar-user-name').textContent = state.profile.name;
    document.getElementById('sidebar-user-streak').textContent = state.profile.streak;
    document.getElementById('header-streak-count').textContent = state.profile.streak;
    
    // Render dynamic streak icons
    renderStreakIcons(state.profile.streak);
    
    // Dynamic VOTD
    renderVotd();
    
    // Suggested Plans
    const plansContainer = document.getElementById('home-suggested-plans');
    plansContainer.innerHTML = '';
    const lang = state.settings.systemLanguage || 'en';
    const isVi = (lang === 'vi');

    getAllPlans().slice(0, 3).forEach(p => {
      const pCard = document.createElement('div');
      pCard.className = 'card';
      pCard.style.padding = '20px';
      pCard.innerHTML = `
        <span class="card-tag" style="font-size:9px;">${translatePlanField(p.category)}</span>
        <h4 style="margin: 8px 0 12px 0; font-size: 14px;">${translatePlanField(p.title)}</h4>
        <span style="font-size:12px; color:var(--text-muted); margin-top:auto;">${p.duration} ${isVi ? 'Ngày' : 'Days'} • ${translatePlanField(p.difficulty)}</span>
      `;
      pCard.addEventListener('click', () => showPlanDetails(p.id));
      plansContainer.appendChild(pCard);
    });

    // Active Plan progress
    const activePlanCard = document.getElementById('home-active-plan-card');
    if (state.plansProgress.active && state.plansProgress.active.planId) {
      const ap = getAllPlans().find(p => p.id === state.plansProgress.active.planId);
      document.getElementById('home-active-plan-title').textContent = translatePlanField(ap.title);
      const curDay = state.plansProgress.active.currentDay;
      const total = ap.duration;
      document.getElementById('home-active-plan-days').textContent = isVi ? `Ngày ${curDay} trên ${total}` : `Day ${curDay} of ${total}`;
      document.getElementById('home-active-plan-progress').style.width = `${((curDay - 1) / total) * 100}%`;
      activePlanCard.style.display = 'flex';
    } else {
      activePlanCard.style.display = 'none';
    }

    // Render Streak Calendar Widget
    const calendarGrid = document.getElementById('streak-calendar-grid');
    if (calendarGrid) {
      calendarGrid.innerHTML = '';
      const streak = state.profile.streak || 0;
      const today = new Date();
      
      // Generate a clean 28-day streak grid
      for (let i = 27; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        
        const cell = document.createElement('div');
        cell.className = 'streak-day-cell';
        cell.textContent = d.getDate();
        
        // Mock streak checked-in days ending today
        if (i < streak) {
          cell.classList.add('completed');
        }
        if (i === 0) {
          cell.classList.add('today');
        }
        calendarGrid.appendChild(cell);
      }

      // Update milestone text
      const milestoneText = document.getElementById('streak-milestone-text');
      if (milestoneText) {
        const nextMilestone = streak <= 7 ? 7 : streak <= 15 ? 15 : streak <= 30 ? 30 : streak + 7;
        const daysLeft = nextMilestone - streak;
        if (daysLeft <= 0) {
          milestoneText.textContent = isVi ? `Chúc mừng! Bạn đạt cột mốc ${nextMilestone} ngày!` : `Congrats! You hit your ${nextMilestone}-day milestone!`;
        } else {
          milestoneText.textContent = isVi ? `Cố lên! Còn ${daysLeft} ngày nữa là đạt cột mốc ${nextMilestone} ngày.` : `Keep going! ${daysLeft} days until your ${nextMilestone}-day milestone.`;
        }
      }
    }

    // Render Achievements / Badges Widget
    const badgesContainer = document.getElementById('badges-grid-container');
    if (badgesContainer) {
      badgesContainer.innerHTML = '';
      const streak = state.profile.streak || 0;
      const notesCount = state.saved.notes.length || 0;
      
      const badgeList = [
        { id: '7day', label: isVi ? 'Chiến binh 7 Ngày' : '7-Day Warrior', desc: isVi ? 'Đọc 7 ngày liên tiếp' : 'Read 7 days in a row', icon: '🔥', unlocked: streak >= 7 },
        { id: 'scholar', label: isVi ? 'Học giả Kinh Thánh' : 'Bible Scholar', desc: isVi ? 'Có 2 ghi chép học tập' : 'Saved 2 study notes', icon: '✍️', unlocked: notesCount >= 2 },
        { id: 'habit30', label: isVi ? 'Thói quen 30 Ngày' : '30-Day Habit', desc: isVi ? 'Đọc 30 ngày liên tiếp' : 'Read 30 days in a row', icon: '👑', unlocked: streak >= 30 }
      ];

      badgeList.forEach(b => {
        const item = document.createElement('div');
        item.className = `badge-item ${b.unlocked ? 'unlocked' : 'locked'}`;
        item.innerHTML = `
          <div class="badge-icon-wrapper">
            <span>${b.unlocked ? b.icon : '🔒'}</span>
          </div>
          <div class="badge-label" style="font-size:10px; font-weight:700; margin-top:4px;">${b.label}</div>
          <div class="badge-desc" style="font-size:8px; color:var(--text-muted); margin-top:2px;">${b.desc}</div>
        `;
        badgesContainer.appendChild(item);
      });
    }
  }

  function renderVotd() {
    const list = window.BIBLE_DATA.votdList;
    const index = state.votdIndex !== undefined ? state.votdIndex : (new Date().getDate() % list.length);
    const item = list[index];
    if (!item) return;

    // Use selected version from state.ui.selectedVersion
    const trans = state.ui.selectedVersion || state.readerState.translation || 'WEB';
    const isVi = (trans === 'VIE' || trans === 'RVV11' || trans === 'NVB' || trans === 'BTT');
    
    // Get text
    let text = "";
    if (window.BIBLE_DATA.staticScriptures[trans] && window.BIBLE_DATA.staticScriptures[trans][item.bookId] && window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter]) {
      const verses = window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter];
      const verseObj = verses.find(v => v.num === item.verseNum);
      if (verseObj) {
        text = verseObj.text;
      }
    }
    if (!text) {
      text = item.text[trans] || item.text['WEB'] || "Scripture not found.";
    }

    // Get book name
    const bookName = isVi ? item.bookName['Tiếng Việt'] : item.bookName['English'];
    const ref = `${bookName} ${item.chapter}:${item.verseNum}`;

    const contentTextEl = document.getElementById('votd-content-text');
    const refTextEl = document.getElementById('votd-ref-text');
    
    if (contentTextEl) {
      contentTextEl.textContent = `“${text}”`;
      
      // Apply UI state: Font Size
      contentTextEl.style.fontSize = `${state.ui.bibleFontSize || 24}px`;
      
      // Apply UI state: Serif/Sans-serif style
      if (state.ui.bibleFontSerif) {
        contentTextEl.classList.remove('sans-serif');
      } else {
        contentTextEl.classList.add('sans-serif');
      }

      // Apply UI state: Highlight color
      contentTextEl.classList.remove('highlight-yellow', 'highlight-blue', 'highlight-green');
      if (state.ui.highlightColor && state.ui.highlightColor !== 'clear') {
        contentTextEl.classList.add(`highlight-${state.ui.highlightColor}`);
      }
    }

    if (refTextEl) {
      refTextEl.textContent = `${ref}`;
    }

    // Sync input selectors in the VOTD controls
    const versionSelect = document.getElementById('votd-version-select');
    const versionBadge = document.getElementById('votd-active-version-badge');
    if (versionSelect) {
      versionSelect.value = trans;
    }
    if (versionBadge) {
      versionBadge.textContent = trans;
    }

    const fontSizeSlider = document.getElementById('votd-font-size-slider');
    if (fontSizeSlider) {
      fontSizeSlider.value = state.ui.bibleFontSize || 24;
    }

    const fontToggleBtn = document.getElementById('votd-font-toggle-btn');
    if (fontToggleBtn) {
      fontToggleBtn.style.fontWeight = state.ui.bibleFontSerif ? '700' : '400';
      fontToggleBtn.textContent = state.ui.bibleFontSerif ? 'Serif' : 'Sans';
    }

    // Sync quick note textarea if open
    const quickNoteInput = document.getElementById('votd-quick-note-text');
    if (quickNoteInput) {
      quickNoteInput.value = state.ui.quickNote || '';
    }
  }

  function renderStreakIcons(streak) {
    const iconContainerHeader = document.getElementById('header-streak-icon-container');
    const iconContainerSidebar = document.getElementById('sidebar-streak-icon-container');
    
    const isZero = (streak === 0);
    const fill = isZero ? 'none' : '#FF6B35';
    const stroke = isZero ? 'var(--text-muted)' : '#FF6B35';
    
    const svgHTML = `
      <svg viewBox="0 0 24 24" width="16" height="16" stroke="${stroke}" stroke-width="2" fill="${fill}" stroke-linejoin="round" stroke-linecap="round" style="transition: all 0.3s ease; display: block;">
        <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"></path>
      </svg>
    `;
    
    if (iconContainerHeader) iconContainerHeader.innerHTML = svgHTML;
    if (iconContainerSidebar) iconContainerSidebar.innerHTML = svgHTML;
  }



  // --- 8. BIBLE READER COMPONENT ---
  let selectedVerses = [];

  function renderBibleReader() {
    const bookId = state.readerState.bookId;
    const chapter = state.readerState.chapter;
    const translation = state.readerState.translation;

    elements.readerBookBtn.textContent = getBookName(bookId);
    const isVi = (state.settings.systemLanguage === 'vi');
    elements.readerChapterBtn.textContent = isVi ? `Chương ${chapter}` : `Chapter ${chapter}`;
    elements.readerVersionBtn.textContent = translation;

    // Render text display
    elements.bibleTextDisplay.innerHTML = '';
    
    // Set custom font settings
    elements.bibleTextDisplay.style.fontSize = `${state.settings.reader.fontSize}px`;
    elements.bibleTextDisplay.style.lineHeight = `${state.settings.reader.lineHeight}`;

    if (state.settings.reader.verseLayout === 'verse') {
      elements.bibleTextDisplay.classList.add('layout-verse');
    } else {
      elements.bibleTextDisplay.classList.remove('layout-verse');
    }

    // Get all verses in this chapter
    const verseCount = window.BIBLE_DATA.getVerseCount(translation, bookId, chapter);
    for (let i = 1; i <= verseCount; i++) {
      const verseText = window.BIBLE_DATA.getVerseText(translation, bookId, chapter, i);
      const span = document.createElement('span');
      span.className = 'verse';
      span.setAttribute('data-verse', i);
      
      // Apply highlights if any
      const savedH = state.saved.highlights.find(h => h.bookId === bookId && h.chapter === chapter && h.verseNum === i);
      if (savedH) {
        if (savedH.color.startsWith('#')) {
          span.style.backgroundColor = getHighlightColorCode(savedH.color);
        } else {
          span.classList.add(`highlighted-${savedH.color}`);
        }
      }

      span.innerHTML = `<span class="verse-num">${i}</span>${verseText} `;
      
      span.addEventListener('click', (e) => {
        toggleVerseSelection(span, i);
      });
      elements.bibleTextDisplay.appendChild(span);
    }

    clearVerseSelection();
  }

  function clearVerseSelection() {
    selectedVerses = [];
    updateVerseSelectionUI();
    if (elements.floatingVerseActionbar) {
      elements.floatingVerseActionbar.style.display = 'none';
    }
  }

  function updateVerseSelectionUI() {
    const verses = elements.bibleTextDisplay.querySelectorAll('.verse');
    verses.forEach((span) => {
      const vNum = parseInt(span.getAttribute('data-verse'));
      const isSel = selectedVerses.includes(vNum);
      
      if (isSel) {
        span.classList.add('selected-for-action');
        
        // Check if previous sibling is also selected
        const prevSpan = span.previousElementSibling;
        const prevSel = prevSpan && prevSpan.classList.contains('verse') && selectedVerses.includes(parseInt(prevSpan.getAttribute('data-verse')));
        if (prevSel) {
          span.classList.add('selected-prev');
        } else {
          span.classList.remove('selected-prev');
        }
        
        // Check if next sibling is also selected
        const nextSpan = span.nextElementSibling;
        const nextSel = nextSpan && nextSpan.classList.contains('verse') && selectedVerses.includes(parseInt(nextSpan.getAttribute('data-verse')));
        if (nextSel) {
          span.classList.add('selected-next');
        } else {
          span.classList.remove('selected-next');
        }
      } else {
        span.classList.remove('selected-for-action', 'selected-prev', 'selected-next');
      }
    });
  }

  function toggleVerseSelection(element, verseNum) {
    if (selectedVerses.includes(verseNum)) {
      selectedVerses = selectedVerses.filter(v => v !== verseNum);
    } else {
      selectedVerses.push(verseNum);
    }
    
    updateVerseSelectionUI();

    if (selectedVerses.length > 0) {
      elements.floatingVerseActionbar.style.display = 'flex';
    } else {
      elements.floatingVerseActionbar.style.display = 'none';
    }
  }

  // Highlight actions
  document.querySelectorAll('.highlight-dots .dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const color = dot.getAttribute('data-color');
      if (!color) return; // Skip custom color trigger picker element
      
      const bookId = state.readerState.bookId;
      const chapter = state.readerState.chapter;
      const translation = state.readerState.translation;

      selectedVerses.forEach(vNum => {
        // Remove existing highlight
        state.saved.highlights = state.saved.highlights.filter(h => !(h.bookId === bookId && h.chapter === chapter && h.verseNum === vNum));
        
        if (color !== 'clear') {
          const verseText = window.BIBLE_DATA.getVerseText(translation, bookId, chapter, vNum);
          state.saved.highlights.push({
            id: `h-${Date.now()}-${vNum}`,
            bookId,
            chapter,
            verseNum: vNum,
            text: verseText,
            color,
            translation,
            time: 'Just now'
          });
        }
      });
      
      saveState();
      renderBibleReader();
      showToast(color === 'clear' 
        ? (state.settings.systemLanguage === 'vi' ? 'Đã xóa tô màu' : 'Highlight removed') 
        : (state.settings.systemLanguage === 'vi' ? 'Đã tô màu câu Kinh Thánh' : 'Scripture highlighted')
      );
    });
  });

  // Bind change listener to custom highlight color input
  const customColorInput = document.getElementById('custom-highlight-color-picker');
  if (customColorInput) {
    customColorInput.addEventListener('change', (e) => {
      const color = e.target.value; // Hex value e.g. "#33aa88"
      if (!color) return;

      const bookId = state.readerState.bookId;
      const chapter = state.readerState.chapter;
      const translation = state.readerState.translation;

      selectedVerses.forEach(vNum => {
        // Remove existing highlight
        state.saved.highlights = state.saved.highlights.filter(h => !(h.bookId === bookId && h.chapter === chapter && h.verseNum === vNum));
        
        const verseText = window.BIBLE_DATA.getVerseText(translation, bookId, chapter, vNum);
        state.saved.highlights.push({
          id: `h-${Date.now()}-${vNum}`,
          bookId,
          chapter,
          verseNum: vNum,
          text: verseText,
          color,
          translation,
          time: 'Just now'
        });
      });

      saveState();
      renderBibleReader();
      showToast(state.settings.systemLanguage === 'vi' ? 'Đã tô màu câu Kinh Thánh' : 'Scripture highlighted');
    });
  }

  // Action: Bookmark
  document.getElementById('actionbar-bookmark').addEventListener('click', () => {
    const bookId = state.readerState.bookId;
    const chapter = state.readerState.chapter;
    const translation = state.readerState.translation;

    selectedVerses.forEach(vNum => {
      const verseText = window.BIBLE_DATA.getVerseText(translation, bookId, chapter, vNum);
      state.saved.bookmarks.push({
        id: `b-${Date.now()}-${vNum}`,
        bookId,
        chapter,
        verseNum: vNum,
        text: verseText,
        translation,
        time: 'Just now'
      });
    });

    saveState();
    renderBibleReader();
    showToast('Verse bookmarked successfully');
  });

  // Action: Note Modal Trigger
  document.getElementById('actionbar-note').addEventListener('click', () => {
    const bookId = state.readerState.bookId;
    const chapter = state.readerState.chapter;
    const vNum = selectedVerses[0];
    const text = window.BIBLE_DATA.getVerseText(state.readerState.translation, bookId, chapter, vNum);

    document.getElementById('note-verse-context').innerHTML = `<span class="verse-num">${vNum}</span>${text}`;
    document.getElementById('note-text-input').value = '';
    elements.addNoteModal.style.display = 'flex';
  });

  document.getElementById('note-save-btn').addEventListener('click', () => {
    const noteText = document.getElementById('note-text-input').value.trim();
    if (!noteText) return;

    const bookId = state.readerState.bookId;
    const chapter = state.readerState.chapter;
    const vNum = selectedVerses[0];
    const text = window.BIBLE_DATA.getVerseText(state.readerState.translation, bookId, chapter, vNum);

    state.saved.notes.push({
      id: `n-${Date.now()}`,
      bookId,
      chapter,
      verseNum: vNum,
      text,
      noteText,
      translation: state.readerState.translation,
      time: 'Just now'
    });

    // Create a mock community item too!
    state.community.feed.unshift({
      id: `feed-note-${Date.now()}`,
      author: state.profile.name,
      avatar: state.profile.avatar,
      type: 'note',
      detail: `shared a note on ${bookId} ${chapter}:${vNum}`,
      text: `“${text.substring(0, 100)}...” Note: ${noteText}`,
      time: 'Just now',
      likes: 0,
      likedByMe: false,
      comments: []
    });

    saveState();
    closeAllModals();
    renderBibleReader();
    showToast('Study note saved & shared');
  });

  // Action: Share Card
  document.getElementById('actionbar-share').addEventListener('click', () => {
    if (selectedVerses.length === 0) return;
    const bookId = state.readerState.bookId;
    const chapter = state.readerState.chapter;
    const translation = state.readerState.translation;

    const sortedVerses = [...selectedVerses].sort((a, b) => a - b);

    let cardHtml = '';
    if (sortedVerses.length === 1) {
      cardHtml = window.BIBLE_DATA.getVerseText(translation, bookId, chapter, sortedVerses[0]);
    } else {
      cardHtml = sortedVerses.map(v => {
        const text = window.BIBLE_DATA.getVerseText(translation, bookId, chapter, v);
        return `<sup>${v}</sup> ${text}`;
      }).join(' ');
    }

    // Helper to format verse range (e.g. 1-3, 5, 7-8)
    const formatVerseRange = (verses) => {
      const sorted = [...verses].sort((a, b) => a - b);
      const groups = [];
      let start = sorted[0];
      let prev = sorted[0];
      for (let i = 1; i < sorted.length; i++) {
        const curr = sorted[i];
        if (curr === prev + 1) {
          prev = curr;
        } else {
          groups.push(start === prev ? `${start}` : `${start}-${prev}`);
          start = curr;
          prev = curr;
        }
      }
      groups.push(start === prev ? `${start}` : `${start}-${prev}`);
      return groups.join(', ');
    };

    const verseRange = formatVerseRange(sortedVerses);

    document.getElementById('share-card-text').innerHTML = `“${cardHtml}”`;
    document.getElementById('share-card-ref').textContent = `${bookId} ${chapter}:${verseRange}`;
    elements.shareCardModal.style.display = 'flex';
  });

  // Customizer styling for share cards
  document.querySelectorAll('#share-card-modal .dot').forEach(bgDot => {
    bgDot.addEventListener('click', () => {
      const bg = bgDot.getAttribute('data-bg');
      const color = bgDot.getAttribute('data-color');
      const canvas = document.getElementById('verse-card-canvas');
      canvas.style.background = bg;
      canvas.style.color = color;
    });
  });

  // Independent text color and font customizers
  const textColors = ['#FFFFFF', '#2C2A24', '#ebd4c3', '#5C6E58', '#292E49', '#7c5c2d'];
  let textColorIndex = 0;
  
  const textColorBtn = document.getElementById('btn-share-text-color');
  if (textColorBtn) {
    textColorBtn.addEventListener('click', () => {
      const canvas = document.getElementById('verse-card-canvas');
      if (canvas) {
        textColorIndex = (textColorIndex + 1) % textColors.length;
        canvas.style.color = textColors[textColorIndex];
      }
    });
  }

  const fontStyles = [
    { family: "'Lora', Georgia, serif", style: 'italic' },
    { family: "'Lora', Georgia, serif", style: 'normal' },
    { family: "'Inter', sans-serif", style: 'normal' },
    { family: "'Inter', sans-serif", style: 'italic' },
    { family: "monospace", style: 'normal' }
  ];
  let fontStyleIndex = 0;

  const fontBtn = document.getElementById('btn-share-text-font');
  if (fontBtn) {
    fontBtn.addEventListener('click', () => {
      const textElement = document.getElementById('share-card-text');
      if (textElement) {
        fontStyleIndex = (fontStyleIndex + 1) % fontStyles.length;
        textElement.style.fontFamily = fontStyles[fontStyleIndex].family;
        textElement.style.fontStyle = fontStyles[fontStyleIndex].style;
      }
    });
  }

  // Custom background image upload trigger
  const uploadBgTrigger = document.getElementById('btn-upload-bg-trigger');
  const uploadBgInput = document.getElementById('share-card-upload-image');
  
  if (uploadBgTrigger && uploadBgInput) {
    uploadBgTrigger.addEventListener('click', () => {
      uploadBgInput.click();
    });
    
    uploadBgInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          const canvas = document.getElementById('verse-card-canvas');
          if (canvas) {
            canvas.style.background = `url('${event.target.result}') center/cover no-repeat`;
            canvas.style.color = '#FFFFFF'; // Ensure readable white text on custom images
          }
        };
        reader.readAsDataURL(file);
      }
    });
  }

  document.getElementById('btn-share-download').addEventListener('click', () => {
    // Mock copying card image / reference to clipboard
    navigator.clipboard.writeText(`${document.getElementById('share-card-text').textContent} — ${document.getElementById('share-card-ref').textContent}`);
    showToast('Verse reference copied to clipboard');
    closeAllModals();
  });

  // Book selection triggers
  elements.readerBookBtn.addEventListener('click', () => {
    renderBooksModal();
    elements.bookSelectModal.style.display = 'flex';
  });

  elements.readerChapterBtn.addEventListener('click', () => {
    renderChaptersModal();
    elements.chapterSelectModal.style.display = 'flex';
  });

  elements.readerVersionBtn.addEventListener('click', () => {
    renderVersionsModal();
    elements.versionSelectModal.style.display = 'flex';
  });

  elements.readerLangBtn.addEventListener('click', () => {
    renderVersionsModal();
    elements.versionSelectModal.style.display = 'flex';
  });

  function renderBooksModal(category = 'OT') {
    const container = document.getElementById('modal-books-list');
    container.innerHTML = '';
    const filtered = window.BIBLE_DATA.books.filter(b => b.category === category);
    
    // Toggle active tabs
    document.getElementById('btn-tab-ot').className = `saved-tab-btn ${category === 'OT' ? 'active' : ''}`;
    document.getElementById('btn-tab-nt').className = `saved-tab-btn ${category === 'NT' ? 'active' : ''}`;

    filtered.forEach(b => {
      const div = document.createElement('div');
      div.className = `interactive-item ${state.readerState.bookId === b.id ? 'selected' : ''}`;
      div.textContent = getBookName(b.id);
      div.addEventListener('click', () => {
        state.readerState.bookId = b.id;
        state.readerState.chapter = 1; // reset to 1
        saveState();
        closeAllModals();
        renderBibleReader();
      });
      container.appendChild(div);
    });
  }

  document.getElementById('btn-tab-ot').addEventListener('click', () => renderBooksModal('OT'));
  document.getElementById('btn-tab-nt').addEventListener('click', () => renderBooksModal('NT'));

  function renderChaptersModal() {
    const grid = document.getElementById('modal-chapters-grid');
    grid.innerHTML = '';
    const book = window.BIBLE_DATA.books.find(b => b.id === state.readerState.bookId);
    if (!book) return;

    for (let i = 1; i <= book.chapters; i++) {
      const btn = document.createElement('button');
      btn.className = `btn ${state.readerState.chapter === i ? 'btn-primary' : 'btn-secondary'}`;
      btn.style.padding = '8px 0';
      btn.textContent = i;
      btn.addEventListener('click', () => {
        state.readerState.chapter = i;
        saveState();
        closeAllModals();
        renderBibleReader();
      });
      grid.appendChild(btn);
    }
  }

  function renderVersionsModal() {
    const container = document.getElementById('modal-versions-list');
    container.innerHTML = '';
    
    // Group translations by language
    const grouped = {};
    window.BIBLE_DATA.translations.forEach(t => {
      const lang = t.lang || 'English';
      if (!grouped[lang]) grouped[lang] = [];
      grouped[lang].push(t);
    });

    Object.keys(grouped).forEach((lang, idx) => {
      // Add Language Header
      const header = document.createElement('div');
      header.style.cssText = `font-size:11px; text-transform:uppercase; letter-spacing:0.05em; color:var(--text-muted); margin: ${idx === 0 ? '0' : '20px'} 0 8px 0; font-weight:700;`;
      header.textContent = lang;
      container.appendChild(header);

      // Render Versions for this language
      grouped[lang].forEach(t => {
        const div = document.createElement('div');
        div.className = `interactive-item ${state.readerState.translation === t.id ? 'selected' : ''}`;
        div.style.marginBottom = '6px';
        div.innerHTML = `
          <div>
            <div style="font-weight:700;">${t.name} (${t.short})</div>
            <div style="font-size:11px; color:var(--text-muted);">${t.desc}</div>
          </div>
        `;
        div.addEventListener('click', () => {
          state.readerState.translation = t.id;
          saveState();
          closeAllModals();
          renderBibleReader();
          showToast(`Switched translation to ${t.short}`);
        });
        container.appendChild(div);
      });
    });
  }


  // Next / Previous Chapters triggers
  elements.prevChapterBtn.addEventListener('click', () => {
    const currentBookIdx = window.BIBLE_DATA.books.findIndex(b => b.id === state.readerState.bookId);
    if (state.readerState.chapter > 1) {
      state.readerState.chapter--;
    } else if (currentBookIdx > 0) {
      const prevBook = window.BIBLE_DATA.books[currentBookIdx - 1];
      state.readerState.bookId = prevBook.id;
      state.readerState.chapter = prevBook.chapters;
    }
    saveState();
    renderBibleReader();
  });

  elements.nextChapterBtn.addEventListener('click', () => {
    const currentBookIdx = window.BIBLE_DATA.books.findIndex(b => b.id === state.readerState.bookId);
    const book = window.BIBLE_DATA.books[currentBookIdx];
    if (state.readerState.chapter < book.chapters) {
      state.readerState.chapter++;
    } else if (currentBookIdx < window.BIBLE_DATA.books.length - 1) {
      const nextBook = window.BIBLE_DATA.books[currentBookIdx + 1];
      state.readerState.bookId = nextBook.id;
      state.readerState.chapter = 1;
    }
    saveState();
    renderBibleReader();
  });

  // Font settings trigger
  elements.readerFontBtn.addEventListener('click', () => {
    document.getElementById('slider-font-size').value = state.settings.reader.fontSize;
    document.getElementById('font-size-value').textContent = `${state.settings.reader.fontSize}px`;
    document.getElementById('slider-line-height').value = state.settings.reader.lineHeight * 10;
    document.getElementById('line-height-value').textContent = `${state.settings.reader.lineHeight}`;
    
    const layoutSelect = document.getElementById('select-verse-layout');
    if (layoutSelect) {
      layoutSelect.value = state.settings.reader.verseLayout || 'paragraph';
    }
    
    elements.fontConfigModal.style.display = 'flex';
  });

  document.getElementById('slider-font-size').addEventListener('input', (e) => {
    const size = parseInt(e.target.value);
    state.settings.reader.fontSize = size;
    document.getElementById('font-size-value').textContent = `${size}px`;
    elements.bibleTextDisplay.style.fontSize = `${size}px`;
    saveState();
  });

  document.getElementById('slider-line-height').addEventListener('input', (e) => {
    const height = parseFloat(e.target.value) / 10;
    state.settings.reader.lineHeight = height;
    document.getElementById('line-height-value').textContent = `${height}`;
    elements.bibleTextDisplay.style.lineHeight = `${height}`;
    saveState();
  });

  const selectVerseLayout = document.getElementById('select-verse-layout');
  if (selectVerseLayout) {
    selectVerseLayout.addEventListener('change', (e) => {
      state.settings.reader.verseLayout = e.target.value;
      saveState();
      renderBibleReader();
    });
  }

  // --- 9. AUDIO SCRIPTURE PLAYER ---
  let isPlayingAudio = false;
  let audioTimer = null;
  let audioSeconds = 0;
  let audioDuration = 222; // simulated 3 mins 42 secs
  let audioSpeed = 1.0;

  elements.readerAudioBtn.addEventListener('click', () => {
    // Open player bar
    elements.audioPlayerBar.style.display = 'flex';
    updateAudioInfo();
  });

  elements.audioBtnClose.addEventListener('click', () => {
    elements.audioPlayerBar.style.display = 'none';
    pauseAudio();
  });

  function updateAudioInfo() {
    const book = window.BIBLE_DATA.books.find(b => b.id === state.readerState.bookId);
    elements.audioTrackTitle.textContent = `${getBookName(state.readerState.bookId)} ${state.readerState.chapter}`;
    elements.audioTrackSubtitle.textContent = `Aura Narration • ${state.readerState.translation}`;
  }

  function formatTime(secs) {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  }

  function playAudio() {
    isPlayingAudio = true;
    elements.playSvg.style.display = 'none';
    elements.pauseSvg.style.display = 'block';
    
    audioTimer = setInterval(() => {
      audioSeconds += audioSpeed;
      if (audioSeconds >= audioDuration) {
        audioSeconds = 0;
        pauseAudio();
        // Go to next chapter
        elements.audioBtnNext.click();
      }
      elements.audioTimeCurrent.textContent = formatTime(audioSeconds);
      elements.audioProgressFill.style.width = `${(audioSeconds / audioDuration) * 100}%`;
    }, 1000);
  }

  function pauseAudio() {
    isPlayingAudio = false;
    elements.playSvg.style.display = 'block';
    elements.pauseSvg.style.display = 'none';
    clearInterval(audioTimer);
  }

  elements.audioBtnPlay.addEventListener('click', () => {
    if (isPlayingAudio) pauseAudio();
    else playAudio();
  });

  elements.audioBtnSpeed.addEventListener('click', () => {
    if (audioSpeed === 1.0) audioSpeed = 1.25;
    else if (audioSpeed === 1.25) audioSpeed = 1.5;
    else if (audioSpeed === 1.5) audioSpeed = 2.0;
    else audioSpeed = 1.0;
    
    elements.audioBtnSpeed.textContent = `${audioSpeed}x`;
  });

  elements.audioBtnPrev.addEventListener('click', () => {
    elements.prevChapterBtn.click();
    updateAudioInfo();
    audioSeconds = 0;
  });

  elements.audioBtnNext.addEventListener('click', () => {
    elements.nextChapterBtn.click();
    updateAudioInfo();
    audioSeconds = 0;
  });

  // --- 10. READING PLANS WORKFLOW ---
  function renderPlansView() {
    const list = document.getElementById('plans-list-container');
    list.innerHTML = '';
    const activeCategory = document.querySelector('.plan-category-tags .active').getAttribute('data-category');
    
    const lang = state.settings.systemLanguage || 'en';
    const isVi = (lang === 'vi');

    const filtered = getAllPlans().filter(p => activeCategory === 'all' || p.category === activeCategory);
    
    filtered.forEach(p => {
      const card = document.createElement('div');
      card.className = 'card';
      
      let isPlanActive = state.plansProgress.active && state.plansProgress.active.planId === p.id;
      let actionText = isPlanActive 
        ? (isVi ? 'Đọc tiếp' : 'Resume') 
        : (isVi ? 'Chi tiết' : 'View Plan');
      
      card.innerHTML = `
        <span class="card-tag">${translatePlanField(p.category)}</span>
        <h3 style="margin: 12px 0 8px 0; font-size:16px;">${translatePlanField(p.title)}</h3>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom: 20px; line-height:1.4;">
          ${translatePlanField(p.description)}
        </p>
        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:auto;">
          <span style="font-size:11px; color:var(--text-muted); font-weight:700;">${p.duration} ${isVi ? 'NGÀY' : 'DAYS'}</span>
          <button class="btn ${isPlanActive ? 'btn-primary' : 'btn-secondary'}" style="padding:6px 16px; font-size:12px;">${actionText}</button>
        </div>
      `;
      card.addEventListener('click', () => showPlanDetails(p.id));
      list.appendChild(card);
    });
  }

  // Bind plan tags
  document.querySelectorAll('.plan-category-tags .category-tag').forEach(tag => {
    tag.addEventListener('click', () => {
      document.querySelectorAll('.plan-category-tags .category-tag').forEach(t => t.classList.remove('active'));
      tag.classList.add('active');
      renderPlansView();
    });
  });

  let currentDetailPlanId = null;

  function showPlanDetails(planId) {
    const p = getAllPlans().find(x => x.id === planId);
    if (!p) return;

    currentDetailPlanId = planId;
    const isVi = (state.settings.systemLanguage === 'vi');
    document.getElementById('plan-detail-title').textContent = translatePlanField(p.title);
    document.getElementById('plan-detail-tag').textContent = translatePlanField(p.category);
    document.getElementById('plan-detail-meta').textContent = isVi 
      ? `${p.duration} Ngày • ${translatePlanField(p.difficulty)} • Phổ biến` 
      : `${p.duration} Days • ${p.difficulty} • ${p.popularity}`;
    document.getElementById('plan-detail-desc').textContent = translatePlanField(p.description);

    // Render outline days
    const outline = document.getElementById('plan-detail-outline');
    outline.innerHTML = '';
    
    const isPlanActive = state.plansProgress.active && state.plansProgress.active.planId === planId;
    const completedList = isPlanActive ? state.plansProgress.active.completedDays : [];

    p.days.forEach(d => {
      const isCompleted = completedList.includes(d.day);
      const div = document.createElement('div');
      div.className = `outline-item ${isCompleted ? 'completed' : ''}`;
      div.innerHTML = `
        <div>
          <div style="font-weight:700; font-size:13px;">${isVi ? 'Ngày' : 'Day'} ${d.day}: ${translatePlanField(d.title)}</div>
          <div style="font-size:11px; color:var(--text-muted);">${d.ref}</div>
        </div>
        <div class="outline-day-icon">
          ${isCompleted ? '✓' : ''}
        </div>
      `;
      
      div.addEventListener('click', () => {
        if (isPlanActive) {
          startPlanSession(planId, d.day);
        } else {
          showToast('Please start the reading plan first.', 'warning');
        }
      });
      outline.appendChild(div);
    });

    const actionBtn = document.getElementById('plan-detail-action-btn');
    if (isPlanActive) {
      actionBtn.textContent = isVi ? 'Tiếp tục kế hoạch' : 'Continue Plan';
      actionBtn.addEventListener('click', () => {
        closeAllModals();
        startPlanSession(planId, state.plansProgress.active.currentDay);
      });
    } else {
      actionBtn.textContent = isVi ? 'Bắt đầu kế hoạch' : 'Start Plan';
      actionBtn.addEventListener('click', () => {
        state.plansProgress.active = {
          planId,
          currentDay: 1,
          completedDays: []
        };
        saveState();
        showToast(`Started plan: ${p.title}`);
        closeAllModals();
        startPlanSession(planId, 1);
      });
    }

    elements.planDetailModal.style.display = 'flex';
  }

  // --- CUSTOM PLAN CREATOR ---
  let createPlanDayCount = 0;

  function createDayItemHTML(dayNum) {
    const isVi = (state.settings.systemLanguage === 'vi');
    return `
      <div class="create-plan-day-card" data-day="${dayNum}" style="background-color:var(--bg-secondary); padding:16px; border-radius:8px; border:1px solid var(--border-color); position:relative; display:flex; flex-direction:column; gap:12px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <h5 class="day-card-number-label" style="margin:0; font-size:13px; color:var(--accent-color); font-weight:700;">${isVi ? 'Ngày' : 'Day'} ${dayNum}</h5>
          ${dayNum > 1 ? `
            <button type="button" class="btn-delete-day" style="background:none; border:none; color:#D9534F; cursor:pointer; padding:4px; display:flex; align-items:center;">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="margin:0;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
          ` : ''}
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:11px; font-weight:600; color:var(--text-muted);">${isVi ? 'Tiêu đề ngày *' : 'Day Title *'}</label>
            <input type="text" class="day-title-input" placeholder="${isVi ? 'Ví dụ: Tạ Ơn Chúa' : 'e.g. Giving Thanks'}" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:6px; background-color:var(--bg-primary); font-size:12px; color:var(--text-primary);">
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:11px; font-weight:600; color:var(--text-muted);">${isVi ? 'Tham chiếu Kinh Thánh *' : 'Scripture Reference *'}</label>
            <input type="text" class="day-ref-input" placeholder="${isVi ? 'Ví dụ: PSA 23:1-6' : 'e.g. PSA 23:1-6'}" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:6px; background-color:var(--bg-primary); font-size:12px; color:var(--text-primary);">
          </div>
        </div>
        <div style="display:flex; flex-direction:column; gap:4px;">
          <label style="font-size:11px; font-weight:600; color:var(--text-muted);">${isVi ? 'Thông điệp tĩnh nguyện *' : 'Devotional Message *'}</label>
          <textarea class="day-devo-input" placeholder="${isVi ? 'Viết bài tĩnh nguyện cho ngày này...' : 'Write the devotional thought...'}" style="width:100%; height:50px; padding:8px 12px; border:1px solid var(--border-color); border-radius:6px; resize:none; background-color:var(--bg-primary); font-size:12px; color:var(--text-primary);"></textarea>
        </div>
        <div style="display:grid; grid-template-columns:1fr 1fr; gap:12px;">
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:11px; font-weight:600; color:var(--text-muted);">${isVi ? 'Câu hỏi suy ngẫm (Tùy chọn)' : 'Reflection Prompt (Optional)'}</label>
            <input type="text" class="day-reflect-input" placeholder="${isVi ? 'Ví dụ: Ba điều bạn biết ơn hôm nay...' : 'e.g. What are you grateful for?'}" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:6px; background-color:var(--bg-primary); font-size:12px; color:var(--text-primary);">
          </div>
          <div style="display:flex; flex-direction:column; gap:4px;">
            <label style="font-size:11px; font-weight:600; color:var(--text-muted);">${isVi ? 'Cầu nguyện trọng tâm (Tùy chọn)' : 'Prayer Focus (Optional)'}</label>
            <input type="text" class="day-prayer-input" placeholder="${isVi ? 'Ví dụ: Lạy Chúa, xin dạy con...' : 'e.g. Lord, teach me...'}" style="padding:8px 12px; border:1px solid var(--border-color); border-radius:6px; background-color:var(--bg-primary); font-size:12px; color:var(--text-primary);">
          </div>
        </div>
      </div>
    `;
  }

  function addCreatePlanDayCard() {
    createPlanDayCount++;
    const container = document.getElementById('create-plan-days-container');
    if (!container) return;
    const div = document.createElement('div');
    div.innerHTML = createDayItemHTML(createPlanDayCount).trim();
    const card = div.firstChild;
    container.appendChild(card);

    // Setup delete button handler if day > 1
    const delBtn = card.querySelector('.btn-delete-day');
    if (delBtn) {
      delBtn.addEventListener('click', () => {
        card.remove();
        reindexCreatePlanDays();
      });
    }
  }

  function reindexCreatePlanDays() {
    const isVi = (state.settings.systemLanguage === 'vi');
    const cards = document.querySelectorAll('#create-plan-days-container .create-plan-day-card');
    createPlanDayCount = cards.length;
    cards.forEach((card, idx) => {
      const newDayNum = idx + 1;
      card.setAttribute('data-day', newDayNum);
      const label = card.querySelector('.day-card-number-label');
      if (label) label.textContent = `${isVi ? 'Ngày' : 'Day'} ${newDayNum}`;
      
      // Update delete button visibility or presence
      const delBtn = card.querySelector('.btn-delete-day');
      if (newDayNum === 1 && delBtn) {
        delBtn.remove();
      } else if (newDayNum > 1 && !delBtn) {
        // Append delete button
        const header = card.querySelector('div:first-child');
        const delBtnHTML = `
          <button type="button" class="btn-delete-day" style="background:none; border:none; color:#D9534F; cursor:pointer; padding:4px; display:flex; align-items:center;">
            <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2" style="margin:0;"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        `;
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = delBtnHTML.trim();
        const newDelBtn = tempDiv.firstChild;
        if (header) {
          header.appendChild(newDelBtn);
          newDelBtn.addEventListener('click', () => {
            card.remove();
            reindexCreatePlanDays();
          });
        }
      }
    });
  }

  // Bind trigger to open create plan modal
  const openCreatePlanBtn = document.getElementById('btn-open-create-plan');
  if (openCreatePlanBtn) {
    openCreatePlanBtn.addEventListener('click', () => {
      // Clear main fields
      const titleIn = document.getElementById('create-plan-input-title');
      const descIn = document.getElementById('create-plan-input-desc');
      const catIn = document.getElementById('create-plan-input-category');
      if (titleIn) titleIn.value = '';
      if (descIn) descIn.value = '';
      if (catIn) catIn.value = 'anxiety';
      
      // Clear container and add day 1
      const container = document.getElementById('create-plan-days-container');
      if (container) {
        container.innerHTML = '';
        createPlanDayCount = 0;
        addCreatePlanDayCard();
      }

      if (elements.createPlanModal) elements.createPlanModal.style.display = 'flex';
    });
  }

  // Bind add day button click
  const addDayBtn = document.getElementById('create-plan-btn-add-day');
  if (addDayBtn) {
    addDayBtn.addEventListener('click', () => {
      addCreatePlanDayCard();
    });
  }

  // Bind save plan click
  const savePlanBtn = document.getElementById('create-plan-btn-save');
  if (savePlanBtn) {
    savePlanBtn.addEventListener('click', () => {
      const isVi = (state.settings.systemLanguage === 'vi');
      const titleVal = document.getElementById('create-plan-input-title');
      const categoryVal = document.getElementById('create-plan-input-category');
      const descVal = document.getElementById('create-plan-input-desc');

      const title = titleVal ? titleVal.value.trim() : '';
      const category = categoryVal ? categoryVal.value : 'anxiety';
      const desc = descVal ? descVal.value.trim() : '';

      if (!title) {
        showToast(isVi ? 'Vui lòng nhập tiêu đề kế hoạch.' : 'Please enter a plan title.', 'warning');
        return;
      }
      if (!desc) {
        showToast(isVi ? 'Vui lòng nhập mô tả kế hoạch.' : 'Please enter a plan description.', 'warning');
        return;
      }

      const dayCards = document.querySelectorAll('#create-plan-days-container .create-plan-day-card');
      if (dayCards.length === 0) {
        showToast(isVi ? 'Kế hoạch phải có ít nhất 1 ngày.' : 'The plan must have at least 1 day.', 'warning');
        return;
      }

      const daysData = [];
      let validationFailed = false;

      dayCards.forEach((card, idx) => {
        if (validationFailed) return;
        const dayNum = idx + 1;
        const dayTitleInput = card.querySelector('.day-title-input');
        const dayRefInput = card.querySelector('.day-ref-input');
        const dayDevoInput = card.querySelector('.day-devo-input');
        const dayReflectInput = card.querySelector('.day-reflect-input');
        const dayPrayerInput = card.querySelector('.day-prayer-input');

        const dayTitle = dayTitleInput ? dayTitleInput.value.trim() : '';
        const dayRef = dayRefInput ? dayRefInput.value.trim().toUpperCase() : '';
        const dayDevo = dayDevoInput ? dayDevoInput.value.trim() : '';
        const dayReflect = dayReflectInput ? dayReflectInput.value.trim() : '';
        const dayPrayer = dayPrayerInput ? dayPrayerInput.value.trim() : '';

        if (!dayTitle || !dayRef || !dayDevo) {
          validationFailed = true;
          showToast(
            isVi 
              ? `Vui lòng điền đầy đủ thông tin bắt buộc (*) cho Ngày ${dayNum}.` 
              : `Please fill out all required fields (*) for Day ${dayNum}.`, 
            'warning'
          );
          return;
        }

        // Validate scripture reference format (e.g. PSA 23:1-6)
        const parsed = parseRefString(dayRef);
        if (!parsed || !parsed.book || isNaN(parsed.chapter) || isNaN(parsed.start)) {
          validationFailed = true;
          showToast(
            isVi 
              ? `Định dạng tham chiếu Kinh Thánh Ngày ${dayNum} không hợp lệ (ví dụ: PSA 23:1-6).` 
              : `Invalid scripture reference format for Day ${dayNum} (e.g., PSA 23:1-6).`, 
            'warning'
          );
          return;
        }

        daysData.push({
          day: dayNum,
          title: dayTitle,
          ref: dayRef,
          devotional: dayDevo,
          reflection: dayReflect || (isVi ? 'Hãy suy ngẫm về phân đoạn Kinh Thánh hôm nay.' : 'Reflect on today\'s passage.'),
          prayer: dayPrayer || (isVi ? 'Lạy Chúa, xin dẫn dắt bước chân con hôm nay.' : 'Lord, guide my path today.')
        });
      });

      if (validationFailed) return;

      const newPlan = {
        id: 'custom_' + Date.now(),
        category: category,
        title: title,
        description: desc,
        duration: dayCards.length,
        difficulty: 'Medium',
        popularity: '100%',
        days: daysData
      };

      if (!state.customPlans) state.customPlans = [];
      state.customPlans.push(newPlan);
      saveState();

      showToast(isVi ? 'Đã tạo kế hoạch đọc Kinh Thánh riêng thành công!' : 'Successfully created custom reading plan!', 'success');
      if (elements.createPlanModal) elements.createPlanModal.style.display = 'none';
      renderPlansView();
    });
  }

  // Plan session active runner state
  let sessionState = {
    planId: null,
    dayNum: null,
    step: 0 // 0: Devo, 1: Scripture, 2: Reflect
  };

  function startPlanSession(planId, dayNum) {
    const plan = getAllPlans().find(p => p.id === planId);
    const day = plan.days.find(d => d.day === dayNum);
    if (!day) return;

    sessionState = { planId, dayNum, step: 0 };
    
    const isVi = (state.settings.systemLanguage === 'vi');
    document.getElementById('session-plan-name').textContent = translatePlanField(plan.title);
    document.getElementById('session-day-title').textContent = isVi 
      ? `Ngày ${dayNum}: ${translatePlanField(day.title)}` 
      : `Day ${dayNum}: ${day.title}`;
    
    // Set text contents
    document.getElementById('session-devotional-text').textContent = day.devotional;
    document.getElementById('session-scripture-reference').textContent = day.ref;
    
    // Resolve scripture text (split reference e.g., "PSA 23:1-6")
    const parsedRef = parseRefString(day.ref);
    let scriptureHTML = '';
    for (let v = parsedRef.start; v <= parsedRef.end; v++) {
      const txt = window.BIBLE_DATA.getVerseText(state.readerState.translation, parsedRef.book, parsedRef.chapter, v);
      scriptureHTML += `<p style="margin-bottom:12px;"><span class="verse-num">${v}</span>${txt}</p>`;
    }
    document.getElementById('session-scripture-body').innerHTML = scriptureHTML;
    
    document.getElementById('session-reflection-prompt').textContent = day.reflection;
    document.getElementById('session-prayer-prompt').textContent = day.prayer;

    // Show Devotional tab first
    setSessionTab(0);
    elements.planSessionModal.style.display = 'flex';
  }

  function setSessionTab(stepIndex) {
    sessionState.step = stepIndex;
    const tabDevo = document.getElementById('btn-session-devo');
    const tabScrip = document.getElementById('btn-session-scripture');
    const tabReflect = document.getElementById('btn-session-reflect');
    
    const contentDevo = document.getElementById('session-devo-section');
    const contentScrip = document.getElementById('session-scripture-section');
    const contentReflect = document.getElementById('session-reflect-section');
    
    const actionBtn = document.getElementById('session-action-btn');
    const prevBtn = document.getElementById('session-prev-tab-btn');

    // Hide all
    contentDevo.style.display = 'none';
    contentScrip.style.display = 'none';
    contentReflect.style.display = 'none';
    tabDevo.classList.remove('active');
    tabScrip.classList.remove('active');
    tabReflect.classList.remove('active');

    prevBtn.style.visibility = (stepIndex === 0) ? 'hidden' : 'visible';

    if (stepIndex === 0) {
      contentDevo.style.display = 'block';
      tabDevo.classList.add('active');
      actionBtn.textContent = 'Read Scripture';
    } else if (stepIndex === 1) {
      contentScrip.style.display = 'block';
      tabScrip.classList.add('active');
      actionBtn.textContent = 'Reflect & Pray';
    } else if (stepIndex === 2) {
      contentReflect.style.display = 'flex';
      tabReflect.classList.add('active');
      actionBtn.textContent = 'Complete Day';
    }
  }

  // Handle action clicks inside session
  document.getElementById('session-action-btn').addEventListener('click', () => {
    if (sessionState.step < 2) {
      setSessionTab(sessionState.step + 1);
    } else {
      // Day completion!
      completePlanDay();
    }
  });

  document.getElementById('session-prev-tab-btn').addEventListener('click', () => {
    if (sessionState.step > 0) {
      setSessionTab(sessionState.step - 1);
    }
  });

  function completePlanDay() {
    const active = state.plansProgress.active;
    if (!active.completedDays.includes(sessionState.dayNum)) {
      active.completedDays.push(sessionState.dayNum);
    }

    const plan = getAllPlans().find(p => p.id === active.planId);
    
    // Check if the plan is completed
    if (active.completedDays.length === plan.duration) {
      // Completed the entire plan!
      state.plansProgress.completed.push(active.planId);
      state.plansProgress.active = null;
      state.profile.stats.plansCompleted++;
      showToast(`🎉 Congratulations! You completed "${plan.title}"!`);
      
      // Seed activity item
      state.community.feed.unshift({
        id: `feed-plan-${Date.now()}`,
        author: state.profile.name,
        avatar: state.profile.avatar,
        type: 'plan',
        detail: `completed the reading plan "${plan.title}"!`,
        text: 'What an incredible journey exploring scriptures together.',
        time: 'Just now',
        likes: 0,
        likedByMe: false,
        comments: []
      });
    } else {
      // Incremented day
      active.currentDay = sessionState.dayNum + 1;
      showToast(`Day ${sessionState.dayNum} completed! Keep going!`);
    }

    // Daily streak increment with persistent date tracking
    const todayStr = new Date().toLocaleDateString('en-CA');
    const isGuest = localStorage.getItem('aurabible_guest') === 'true';
    const token = localStorage.getItem('aurabible_token');
    let keySuffix = 'guest';
    if (token) {
      try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const payload = JSON.parse(window.atob(base64));
        keySuffix = payload.id;
      } catch(e) {}
    }
    const storageKey = `aurabible_last_streak_date_${keySuffix}`;

    if (!state.profile.todayCompleted) {
      state.profile.streak++;
      state.profile.todayCompleted = true;
      localStorage.setItem(storageKey, todayStr);
    }

    saveState();
    closeAllModals();
    renderHomeView();
    navigateTo('home');
  }

  // Ref parser helper (e.g. "PSA 23:1-6" -> { book: "PSA", chapter: 23, start: 1, end: 6 })
  function parseRefString(ref) {
    try {
      const parts = ref.trim().split(' ');
      if (parts.length < 2) return null;
      const book = parts[0].toUpperCase();
      const chapVerse = parts[1].split(':');
      if (chapVerse.length < 2) return null;
      const chapter = parseInt(chapVerse[0]);
      const verses = chapVerse[1].split('-');
      const start = parseInt(verses[0]);
      const end = verses[1] ? parseInt(verses[1]) : start;
      if (isNaN(chapter) || isNaN(start) || isNaN(end)) return null;
      return { book, chapter, start, end };
    } catch (e) {
      return null;
    }
  }

  // Home Quick Action Devotional Reading trigger
  document.getElementById('home-devo-start-btn').addEventListener('click', () => {
    // Starts the anxiety plan or another active plan
    let activePlanId = 'anxiety';
    if (state.plansProgress.active && state.plansProgress.active.planId) {
      activePlanId = state.plansProgress.active.planId;
    }
    showPlanDetails(activePlanId);
  });

  // --- 11. PRAYER JOURNAL FLOW ---
  let activePrayerTab = 'my'; // 'my' or 'community'

  function renderPrayerView() {
    const list = document.getElementById('my-prayers-list');
    if (!list) return;
    list.innerHTML = '';
    
    const isVi = (state.settings.systemLanguage === 'vi');
    const filterRow = document.getElementById('prayer-filters-row');
    const countDisplay = document.getElementById('prayer-count-display');

    if (activePrayerTab === 'my') {
      if (filterRow) filterRow.style.display = 'flex';
      const filterAnswered = document.getElementById('filter-prayers-answered').classList.contains('active');
      
      const sorted = [...state.prayers].reverse();
      const filtered = sorted.filter(p => !filterAnswered || p.answered);

      if (countDisplay) {
        countDisplay.textContent = isVi 
          ? `Đang hiển thị ${filtered.length} lời cầu nguyện` 
          : `Showing ${filtered.length} journal items`;
      }

      if (filtered.length === 0) {
        list.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin:40px 0;">${isVi ? 'Không có lời cầu nguyện nào trong phần này.' : 'No prayers logged in this section.'}</p>`;
        return;
      }

      filtered.forEach(p => {
        const card = document.createElement('div');
        card.className = `saved-item-card ${p.answered ? 'answered' : ''}`;
        card.style.opacity = p.answered ? 0.7 : 1;
        
        let shareStatusText = isVi ? '🔒 Riêng tư' : '🔒 Private';
        if (p.isPublic) {
          shareStatusText = isVi ? '🌐 Công khai' : '🌐 Public';
        } else if (p.isFriends) {
          shareStatusText = isVi ? '👥 Chia sẻ với bạn bè' : '👥 Shared with friends';
        }
        
        card.innerHTML = `
          <div class="saved-item-header">
            <span>${isVi ? 'Đã ghi nhận' : 'Logged'} ${translateTime(p.time || p.date || 'Just now')}</span>
            <span style="font-weight:700; color:var(--accent-color);">${shareStatusText}</span>
          </div>
          <p style="font-size:14px; margin: 8px 0; line-height:1.5; font-style: ${p.answered ? 'italic' : 'normal'};">${p.text}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:8px;">
            <span style="font-size:12px; color:var(--text-muted);">${p.prayCount || 0} ${isVi ? 'lượt cầu nguyện đã nhận' : 'prayers received'}</span>
            <div style="display:flex; gap:8px;">
              <button class="btn btn-secondary" onclick="window.AURA_APP.toggleAnswered('${p.id}')" style="padding:4px 12px; font-size:11px;">
                ${p.answered ? (isVi ? '✓ Đã nhậm lời!' : '✓ Answered!') : (isVi ? 'Đã nhậm lời' : 'Mark Answered')}
              </button>
              <button class="btn btn-secondary" onclick="window.AURA_APP.deletePrayer('${p.id}')" style="padding:4px 8px; font-size:11px; color:#D9534F;">🗑</button>
            </div>
          </div>
        `;
        list.appendChild(card);
      });
    } else {
      // Community Praise Wall
      if (filterRow) filterRow.style.display = 'none';
      list.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin:40px 0;">${isVi ? 'Đang tải lời cầu nguyện cộng đồng...' : 'Loading community prayers...'}</p>`;

      fetch(API_BASE + '/api/prayers/public')
        .then(res => res.json())
        .then(prayers => {
          list.innerHTML = '';
          if (prayers.length === 0) {
            list.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin:40px 0;">${isVi ? 'Chưa có lời cầu nguyện công khai nào. Hãy là người đầu tiên chia sẻ!' : 'No public prayers shared yet. Be the first to share!'}</p>`;
            return;
          }

          prayers.forEach(p => {
            const card = document.createElement('div');
            card.className = `saved-item-card ${p.answered ? 'answered' : ''}`;
            card.style.borderLeft = p.answered ? '4px solid #5CB85C' : '4px solid var(--accent-color)';
            
            card.innerHTML = `
              <div style="display: flex; gap: 10px; margin-bottom: 8px;">
                <img src="${p.avatar || 'https://api.dicebear.com/7.x/adventurer/svg?seed=guest'}" style="width: 32px; height: 32px; border-radius: 50%;" alt="avatar">
                <div>
                  <div style="font-weight: 700; font-size: 13px; color: var(--text-primary);">${p.author}</div>
                  <div style="font-size: 11px; color: var(--text-muted);">${isVi ? 'Đăng' : 'Posted'} ${translateTime(p.time || p.date || 'Just now')}</div>
                </div>
              </div>
              <p style="font-size:14px; margin: 8px 0; line-height:1.5;">${p.text}</p>
              
              <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px; border-top: 1px solid var(--border-color); padding-top: 8px;">
                <span style="font-size:12px; color: var(--accent-color); font-weight: 600;">
                  ${p.answered 
                    ? `🙌 ${isVi ? 'Praise: Lời cầu nguyện đã được nhậm!' : 'Praise: Answered!'}` 
                    : `🙏 ${p.prayCount || 0} ${isVi ? 'người đang cầu nguyện' : 'praying together'}`}
                </span>
                
                ${!p.answered ? `
                  <button class="btn btn-secondary btn-sm" onclick="window.AURA_APP.prayForRequest('${p.id}')" style="padding:4px 12px; font-size:11px; display: inline-flex; align-items: center; gap: 4px;">
                    <span>🙏</span> ${isVi ? 'Đồng tâm cầu nguyện' : 'I Prayed'}
                  </button>
                ` : `
                  <button class="btn btn-secondary btn-sm" onclick="window.AURA_APP.prayForRequest('${p.id}')" style="padding:4px 12px; font-size:11px; display: inline-flex; align-items: center; gap: 4px; background: rgba(92,184,92,0.1); color: #5CB85C; border-color: rgba(92,184,92,0.3);">
                    <span>🙌</span> ${isVi ? 'Tạ ơn Chúa' : 'Hallelujah'}
                  </button>
                `}
              </div>
            `;
            list.appendChild(card);
          });
        })
        .catch(err => {
          list.innerHTML = `<p style="text-align:center; color:#D9534F; margin:40px 0;">${isVi ? 'Lỗi kết nối máy chủ.' : 'Server connection error.'}</p>`;
        });
    }
  }

  // Bind sub-tabs
  const tabMy = document.getElementById('prayer-tab-my');
  const tabCommunity = document.getElementById('prayer-tab-community');

  if (tabMy && tabCommunity) {
    tabMy.style.outline = 'none';
    tabCommunity.style.outline = 'none';
    
    tabMy.addEventListener('click', () => {
      activePrayerTab = 'my';
      tabMy.classList.add('active');
      tabMy.style.borderBottom = '2px solid var(--accent-color)';
      tabMy.style.color = 'var(--accent-color)';
      tabCommunity.classList.remove('active');
      tabCommunity.style.borderBottom = 'none';
      tabCommunity.style.color = 'var(--text-muted)';
      renderPrayerView();
    });

    tabCommunity.addEventListener('click', () => {
      activePrayerTab = 'community';
      tabCommunity.classList.add('active');
      tabCommunity.style.borderBottom = '2px solid var(--accent-color)';
      tabCommunity.style.color = 'var(--accent-color)';
      tabMy.classList.remove('active');
      tabMy.style.borderBottom = 'none';
      tabMy.style.color = 'var(--text-muted)';
      renderPrayerView();
    });
  }

  // Interactive pray request button
  window.AURA_APP.prayForRequest = function(prayerId) {
    const token = localStorage.getItem('aurabible_token');
    if (!token) {
      showToast('Please sign in to support this prayer request!');
      return;
    }

    fetch(API_BASE + '/api/prayers/pray', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ prayerId })
    })
    .then(res => res.json())
    .then(data => {
      renderPrayerView();
      if (data.prayed) {
        showToast(state.settings.systemLanguage === 'vi' ? 'Đã gửi lời đồng tâm cầu nguyện!' : 'Added your prayer agreement!');
        publishCommunityFeedPost(state.settings.systemLanguage === 'vi' ? 'đã đồng tâm cầu nguyện cho một ý chỉ' : 'joined in agreement for a prayer request', '');
      } else {
        showToast(state.settings.systemLanguage === 'vi' ? 'Đã bỏ đồng tâm cầu nguyện.' : 'Removed prayer agreement.');
      }
    })
    .catch(err => {
      console.error(err);
      showToast('Server connection error.');
    });
  }

  // Filter Buttons
  document.getElementById('filter-prayers-all').addEventListener('click', () => {
    document.getElementById('filter-prayers-all').classList.add('active');
    document.getElementById('filter-prayers-answered').classList.remove('active');
    renderPrayerView();
  });

  document.getElementById('filter-prayers-answered').addEventListener('click', () => {
    document.getElementById('filter-prayers-all').classList.remove('active');
    document.getElementById('filter-prayers-answered').classList.add('active');
    renderPrayerView();
  });

  // Submit Prayer Request
  document.getElementById('prayer-submit-btn').addEventListener('click', () => {
    const text = document.getElementById('prayer-input').value.trim();
    if (!text) return;

    const isFriends = document.getElementById('prayer-friends-checkbox').checked;
    const isPublic = document.getElementById('prayer-public-checkbox').checked;

    const newPrayer = {
      id: `pr-${Date.now()}`,
      author: state.profile.name,
      avatar: state.profile.avatar,
      text,
      isFriends,
      isPublic,
      answered: false,
      prayCount: 0,
      time: 'Just now'
    };

    state.prayers.push(newPrayer);

    if (isPublic) {
      publishCommunityFeedPost(state.settings.systemLanguage === 'vi' ? 'đã yêu cầu hỗ trợ cầu nguyện' : 'posted a public prayer request', `“${text}”`);
    } else if (isFriends) {
      publishCommunityFeedPost(state.settings.systemLanguage === 'vi' ? 'đã chia sẻ một ý chỉ cầu nguyện với bạn bè' : 'shared a prayer request with friends', '');
    }

    saveState();
    document.getElementById('prayer-input').value = '';
    renderPrayerView();
    showToast('Prayer request logged.');
  });

  // Global methods for prayer
  window.AURA_APP = window.AURA_APP || {};
  
  window.AURA_APP.toggleAnswered = function(prayerId) {
    const pr = state.prayers.find(p => p.id === prayerId);
    if (pr) {
      pr.answered = !pr.answered;
      if (pr.answered) {
        showToast('Praise God! Mark as Answered Prayer.');
        
        // Post update to community feed
        if (pr.isPublic) {
          state.community.feed.unshift({
            id: `feed-ans-${Date.now()}`,
            author: state.profile.name,
            avatar: state.profile.avatar,
            type: 'praise',
            detail: 'shared answered prayer praise!',
            text: `Answered request: “${pr.text}”`,
            time: 'Just now',
            likes: 0,
            likedByMe: false,
            comments: []
          });
        }
      }
      saveState();
      renderPrayerView();
    }
  };

  window.AURA_APP.deletePrayer = function(prayerId) {
    state.prayers = state.prayers.filter(p => p.id !== prayerId);
    saveState();
    renderPrayerView();
    showToast('Prayer entry deleted');
  };

  // --- 11.5. SERMONS JOURNAL FLOW ---
  function renderSermonsView() {
    const list = document.getElementById('sermons-list-container');
    if (!list) return;
    list.innerHTML = '';

    const isVi = (state.settings.systemLanguage === 'vi');
    
    // Sort custom sermons first (reverse order of creation)
    const sorted = [...state.sermons].reverse();

    if (sorted.length === 0) {
      list.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin:40px 0;">${isVi ? 'Không có bài giảng nào được ghi lại.' : 'No sermons recorded yet.'}</p>`;
      return;
    }

    sorted.forEach(s => {
      const card = document.createElement('div');
      card.className = 'saved-item-card';
      
      card.innerHTML = `
        <div class="saved-item-header">
          <span>${isVi ? 'Ghi chép lúc' : 'Recorded'} ${translateTime(s.time)}</span>
          <button class="btn btn-secondary" onclick="window.AURA_APP.deleteSermon('${s.id}')" style="padding:2px 6px; font-size:11px; color:#D9534F;" title="${isVi ? 'Xóa ghi chép' : 'Delete note'}">🗑</button>
        </div>
        <h4 style="margin: 8px 0 4px 0; font-size:16px; font-weight:700; color:var(--text-primary);">${s.title}</h4>
        <div style="font-size:12px; color:var(--text-muted); margin-bottom:10px;">
          <span>👤 ${isVi ? 'Diễn giả' : 'Speaker'}: ${s.speaker}</span> &bull; 
          <span>📖 ${isVi ? 'Kinh Thánh' : 'Passage'}: ${s.passage}</span>
        </div>
        <p style="font-size:13px; line-height:1.5; color:var(--text-secondary); background:var(--bg-primary); padding:10px; border-radius:6px; border:1px solid var(--border-color); white-space: pre-wrap; margin:0;">${s.notes}</p>
      `;
      list.appendChild(card);
    });
  }

  // Bind submit button for new sermon notes
  const sermonSubmitBtn = document.getElementById('sermon-submit-btn');
  if (sermonSubmitBtn) {
    sermonSubmitBtn.addEventListener('click', () => {
      const titleIn = document.getElementById('sermon-input-title');
      const speakerIn = document.getElementById('sermon-input-speaker');
      const passageIn = document.getElementById('sermon-input-passage');
      const notesIn = document.getElementById('sermon-input-notes');
      
      const titleVal = titleIn ? titleIn.value.trim() : '';
      const speakerVal = speakerIn ? speakerIn.value.trim() : '';
      const passageVal = passageIn ? passageIn.value.trim() : '';
      const notesVal = notesIn ? notesIn.value.trim() : '';

      const isVi = (state.settings.systemLanguage === 'vi');

      if (!titleVal) {
        showToast(isVi ? 'Vui lòng nhập chủ đề bài giảng' : 'Please enter a sermon title');
        return;
      }

      state.sermons.push({
        id: `s-${Date.now()}`,
        title: titleVal,
        speaker: speakerVal || (isVi ? 'Chưa rõ' : 'Unknown'),
        passage: passageVal || (isVi ? 'Chưa rõ' : 'Unknown'),
        notes: notesVal,
        time: 'Just now'
      });

      saveState();
      renderSermonsView();

      // Clear input fields
      if (titleIn) titleIn.value = '';
      if (speakerIn) speakerIn.value = '';
      if (passageIn) passageIn.value = '';
      if (notesIn) notesIn.value = '';

      showToast(isVi ? 'Đã lưu ghi chép bài giảng' : 'Sermon notes saved successfully');
    });
  }

  window.AURA_APP.deleteSermon = function(sermonId) {
    state.sermons = state.sermons.filter(s => s.id !== sermonId);
    saveState();
    renderSermonsView();
    const isVi = (state.settings.systemLanguage === 'vi');
    showToast(isVi ? 'Đã xóa ghi chép bài giảng' : 'Sermon note deleted');
  };

  // Helper to publish updates to community feed on backend
  function publishCommunityFeedPost(actionText, targetText) {
    const token = localStorage.getItem('aurabible_token');
    if (token) {
      fetch(API_BASE + '/api/community/post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ actionText, targetText })
      })
      .then(() => {
        // If community view is open, reload it
        if (document.getElementById('community-view').classList.contains('active-view')) {
          renderCommunityView();
        }
      })
      .catch(err => console.error('Error posting to community:', err));
    }
  }

  // --- 12. COMMUNITY FEED COMPONENT ---
  function renderCommunityView() {
    const isVi = (state.settings.systemLanguage === 'vi');
    const feedContainer = document.getElementById('community-feed-container');

    // Fetch feed from backend
    fetch(API_BASE + '/api/community/feed')
      .then(res => res.json())
      .then(feedItems => {
        feedContainer.innerHTML = '';
        
        // Find current user id if logged in
        let currentUserId = null;
        const token = localStorage.getItem('aurabible_token');
        if (token) {
          try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const payload = JSON.parse(window.atob(base64));
            currentUserId = payload.id;
          } catch(e) {}
        }

        feedItems.forEach(item => {
          const feedItem = document.createElement('div');
          feedItem.className = 'activity-card';
          
          let blockContent = '';
          if (item.targetText) {
            if (item.actionText.includes('tô màu') || item.actionText.includes('highlighted') || item.actionText.includes('tô màu') || item.actionText.includes('highlight') || item.actionText.includes('nhắc')) {
              blockContent = `<div class="activity-quote">${item.targetText}</div>`;
            } else {
              blockContent = `<p style="margin-top:8px;">${item.targetText}</p>`;
            }
          }

          // Check comments
          let commentsHTML = '';
          if (item.comments && item.comments.length > 0) {
            commentsHTML = `
              <div style="background-color:var(--bg-primary); padding:12px; border-radius:8px; margin-top:12px; display:flex; flex-direction:column; gap:8px;">
                ${item.comments.map(c => `
                  <div style="font-size:12px;">
                    <strong style="color:var(--accent-color);">${c.userName}:</strong> ${c.text}
                    <span style="font-size:10px; color:var(--text-muted); float:right;">${translateTime(c.time)}</span>
                  </div>
                `).join('')}
              </div>
            `;
          }

          const likedByMe = item.likedUsers && item.likedUsers.includes(currentUserId);

          feedItem.innerHTML = `
            <div class="activity-header">
              <img src="${item.userAvatar}" class="activity-avatar" alt="User">
              <div>
                <div class="activity-desc"><strong>${item.userName}</strong> ${translateActivityDetail(item.actionText)}</div>
                <div class="activity-time">${translateTime(item.time)}</div>
              </div>
            </div>
            <div class="activity-content">
              ${blockContent}
              ${commentsHTML}
            </div>
            <div class="activity-footer">
              <button class="activity-btn ${likedByMe ? 'liked' : ''}" onclick="window.AURA_APP.likeFeedItem('${item.id}')">
                <svg viewBox="0 0 24 24"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg>
                <span>${item.likes} ${isVi ? 'Khích lệ' : 'Encouragements'}</span>
              </button>
              <button class="activity-btn" onclick="window.AURA_APP.commentFeedItem('${item.id}')">
                <svg viewBox="0 0 24 24"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                <span>${isVi ? 'Bình luận' : 'Comment'}</span>
              </button>
            </div>
          `;
          feedContainer.appendChild(feedItem);
        });
      })
      .catch(err => {
        console.error('Error fetching community feed:', err);
        feedContainer.innerHTML = `<p style="color:var(--text-muted); text-align:center;">Failed to load feed</p>`;
      });

    // Render Friends List
    const friendsContainer = document.getElementById('friends-list-container');
    friendsContainer.innerHTML = '';

    state.community.friends.forEach(f => {
      const div = document.createElement('div');
      div.className = 'interactive-item';
      const friendStatusText = f.plan === 'None' 
        ? (isVi ? 'Đang rảnh' : 'Idle') 
        : (isVi ? `Đang học: ${translatePlanField(f.plan)}` : `Studying: ${f.plan}`);
      div.innerHTML = `
        <div style="display:flex; align-items:center; gap:12px;">
          <img src="${f.avatar}" style="width:32px; height:32px; border-radius:50%; object-fit:cover;">
          <div>
            <div style="font-weight:600; font-size:13px;">${f.name}</div>
            <div style="font-size:11px; color:var(--text-muted);">${friendStatusText}</div>
          </div>
        </div>
        <div style="width:8px; height:8px; border-radius:50%; background-color:${f.online ? '#5CB85C' : 'transparent'};"></div>
      `;
      friendsContainer.appendChild(div);
    });
  }

  // Friends Actions
  document.getElementById('add-friend-btn').addEventListener('click', () => {
    const name = prompt("Enter friend's full name to search:");
    if (!name) return;

    const avatars = [
      'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=150',
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150'
    ];
    const randAvatar = avatars[Math.floor(Math.random() * avatars.length)];

    state.community.friends.push({
      id: state.community.friends.length + 1,
      name,
      avatar: randAvatar,
      online: true,
      plan: 'Walk in Divine Love'
    });

    saveState();
    renderCommunityView();
    showToast(`Added friend: ${name}`);
  });

  window.AURA_APP.likeFeedItem = function(id) {
    const token = localStorage.getItem('aurabible_token');
    if (!token) {
      showToast('Please sign in to encourage friends!');
      return;
    }

    fetch(API_BASE + '/api/community/like', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ feedItemId: id })
    })
    .then(res => res.json())
    .then(() => {
      renderCommunityView();
    })
    .catch(err => console.error(err));
  };

  window.AURA_APP.commentFeedItem = function(id) {
    const token = localStorage.getItem('aurabible_token');
    if (!token) {
      showToast('Please sign in to write comments!');
      return;
    }

    const commentText = prompt("Add encouragement comment:");
    if (!commentText) return;

    fetch(API_BASE + '/api/community/comment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ feedItemId: id, text: commentText })
    })
    .then(res => res.json())
    .then(() => {
      renderCommunityView();
      showToast('Comment posted.');
    })
    .catch(err => console.error(err));
  };

  // --- 13. SAVED VIEW COMPONENT ---
  let activeSavedTab = 'highlights';

  function renderSavedView() {
    const container = document.getElementById('saved-content-list');
    container.innerHTML = '';
    
    // Toggle active saved tab class
    document.querySelectorAll('.saved-tabs .saved-tab-btn').forEach(btn => {
      if (btn.getAttribute('data-tab') === activeSavedTab) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });

    const isVi = (state.settings.systemLanguage === 'vi');
    const colorTranslate = {
      yellow: (isVi ? 'TÔ MÀU VÀNG' : 'YELLOW HIGHLIGHT'),
      green: (isVi ? 'TÔ MÀU XANH LÁ' : 'GREEN HIGHLIGHT'),
      blue: (isVi ? 'TÔ MÀU XANH DƯƠNG' : 'BLUE HIGHLIGHT'),
      pink: (isVi ? 'TÔ MÀU HỒNG' : 'PINK HIGHLIGHT')
    };
    
    const tabNameTranslate = {
      highlights: (isVi ? 'mục tô màu' : 'highlights'),
      bookmarks: (isVi ? 'mục đánh dấu' : 'bookmarks'),
      notes: (isVi ? 'mục ghi chú' : 'notes')
    };

    const items = state.saved[activeSavedTab];
    if (items.length === 0) {
      container.innerHTML = `<p style="text-align:center; color:var(--text-muted); margin:40px 0;">${isVi ? `Không tìm thấy ${tabNameTranslate[activeSavedTab]} nào.` : `No items found in ${activeSavedTab}.`}</p>`;
      return;
    }

    items.forEach(item => {
      const card = document.createElement('div');
      card.className = 'saved-item-card';

      const verseText = window.BIBLE_DATA.getVerseText(state.readerState.translation, item.bookId, item.chapter, item.verseNum);

      let detailsHTML = '';
      if (activeSavedTab === 'highlights') {
        const isCustom = item.color.startsWith('#');
        const tagText = isCustom 
          ? (isVi ? 'TÔ MÀU TỰ CHỌN' : 'CUSTOM HIGHLIGHT') 
          : (colorTranslate[item.color] || item.color.toUpperCase() + ' HIGHLIGHT');
        detailsHTML = `
          <div class="saved-item-header">
            <span class="card-tag" style="background-color:${getHighlightColorCode(item.color)}; color:#2C2A24; padding:2px 8px; font-size:10px;">${tagText}</span>
            <span>${translateTime(item.time)}</span>
          </div>
          <p style="font-family:'Lora', Georgia, serif; font-size:18px; margin-top:8px; line-height:1.4;">${verseText}</p>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <span style="font-size:12px; font-weight:700; color:var(--accent-color);">${getBookName(item.bookId)} ${item.chapter}:${item.verseNum}</span>
            <button class="btn btn-secondary" onclick="window.AURA_APP.jumpToRef('view-bible:${item.bookId}:${item.chapter}')" style="padding:4px 12px; font-size:11px;">${isVi ? 'Xem Ngữ Cảnh' : 'Study Context'}</button>
          </div>
        `;
      } else if (activeSavedTab === 'bookmarks') {
        detailsHTML = `
          <div class="saved-item-header">
            <span>${isVi ? 'Đã đánh dấu' : 'Bookmarked'} ${translateTime(item.time)}</span>
            <button class="btn btn-secondary" onclick="window.AURA_APP.deleteSaved('bookmarks', '${item.id}')" style="padding:2px 6px; font-size:11px; color:#D9534F;">🗑</button>
          </div>
          <p style="font-family:'Lora', Georgia, serif; font-size:18px; line-height:1.4; margin:6px 0;">${verseText}</p>
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:12px; font-weight:700; color:var(--accent-color);">${getBookName(item.bookId)} ${item.chapter}:${item.verseNum}</span>
            <button class="btn btn-secondary" onclick="window.AURA_APP.jumpToRef('view-bible:${item.bookId}:${item.chapter}')" style="padding:4px 12px; font-size:11px;">${isVi ? 'Đọc Cả Chương' : 'Read Chapter'}</button>
          </div>
        `;
      } else if (activeSavedTab === 'notes') {
        detailsHTML = `
          <div class="saved-item-header">
            <span>${isVi ? 'Ghi chú lúc' : 'Note taken'} ${translateTime(item.time)}</span>
            <button class="btn btn-secondary" onclick="window.AURA_APP.deleteSaved('notes', '${item.id}')" style="padding:2px 6px; font-size:11px; color:#D9534F;">🗑</button>
          </div>
          <p style="font-family:'Lora', Georgia, serif; font-size:18px; line-height:1.4; color:var(--text-secondary); padding:8px; border-left:3px solid var(--accent-color); background-color:rgba(0,0,0,0.02);">${verseText}</p>
          <div style="font-weight:600; font-size:14px; margin-top:8px;">${isVi ? 'Ghi chú' : 'Notes'}: ${item.noteText}</div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-top:12px;">
            <span style="font-size:12px; font-weight:700; color:var(--accent-color);">${getBookName(item.bookId)} ${item.chapter}:${item.verseNum}</span>
            <button class="btn btn-secondary" onclick="window.AURA_APP.jumpToRef('view-bible:${item.bookId}:${item.chapter}')" style="padding:4px 12px; font-size:11px;">${isVi ? 'Xem Ngữ Cảnh' : 'Study Context'}</button>
          </div>
        `;
      }

      card.innerHTML = detailsHTML;
      container.appendChild(card);
    });
  }

  function hexToRgba(hex, alpha) {
    if (!hex || hex.length < 7) return 'rgba(0,0,0,0.1)';
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }

  function getHighlightColorCode(color) {
    if (!color) return 'transparent';
    if (color.startsWith('#')) {
      return hexToRgba(color, 0.45);
    }
    if (color === 'yellow') return '#f9e79f';
    if (color === 'green') return '#abebc6';
    if (color === 'blue') return '#aed6f1';
    if (color === 'pink') return '#f9ebf2';
    return 'transparent';
  }

  // Saved items tab bindings
  document.querySelectorAll('.saved-tabs .saved-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      activeSavedTab = btn.getAttribute('data-tab');
      renderSavedView();
    });
  });

  window.AURA_APP.deleteSaved = function(tabName, id) {
    state.saved[tabName] = state.saved[tabName].filter(item => item.id !== id);
    saveState();
    renderSavedView();
    showToast('Saved item removed');
  };

  // Jump to references easily (e.g. "view-bible:PSA:23")
  window.AURA_APP.jumpToRef = function(actionString) {
    const parts = actionString.split(':');
    if (parts[0] === 'view-bible') {
      state.readerState.bookId = parts[1];
      state.readerState.chapter = parseInt(parts[2]);
      saveState();
      navigateTo('bible');
    }
    // Auto-close drawers/modals
    elements.searchDrawer.classList.remove('open');
    closeAllModals();
  };

  window.AURA_APP.showPlanDetails = function(planId) {
    closeAllModals();
    elements.searchDrawer.classList.remove('open');
    showPlanDetails(planId);
  };

  // --- 14. USER PROFILE VIEW COMPONENT ---
  function renderProfileView() {
    const avatarEl = document.getElementById('profile-avatar');
    if (avatarEl) avatarEl.src = state.profile.avatar;
    const nameEl = document.getElementById('profile-name');
    if (nameEl) nameEl.textContent = state.profile.name;
    const joinedEl = document.getElementById('profile-joined');
    if (joinedEl) joinedEl.textContent = state.profile.joinedDate;
    
    // Inputs sync
    const inputName = document.getElementById('profile-input-name');
    if (inputName) inputName.value = state.profile.name;
    const inputEmail = document.getElementById('profile-input-email');
    if (inputEmail) inputEmail.value = state.profile.email;

    // Stats
    const streakEl = document.getElementById('stat-streak');
    if (streakEl) streakEl.textContent = state.profile.streak || 0;
    const highlightsEl = document.getElementById('stat-highlights');
    if (highlightsEl) highlightsEl.textContent = state.saved.highlights ? state.saved.highlights.length : 0;
    const notesEl = document.getElementById('stat-notes');
    if (notesEl) notesEl.textContent = state.saved.notes ? state.saved.notes.length : 0;
    const prayersEl = document.getElementById('stat-prayers');
    if (prayersEl) prayersEl.textContent = state.prayers ? state.prayers.length : 0;

    // Recent Active Plan
    const active = state.plansProgress && state.plansProgress.active;
    const activePlanTitle = document.getElementById('profile-active-plan-title');
    const activePlanDesc = document.getElementById('profile-active-plan-desc');
    const activePlanPercent = document.getElementById('profile-active-plan-percent');
    const activePlanDays = document.getElementById('profile-active-plan-days');
    const activePlanProgress = document.getElementById('profile-active-plan-progress');

    if (active && active.planId) {
      const allPlans = window.BIBLE_DATA.readingPlans || [];
      const planDetails = allPlans.find(p => p.id === active.planId);
      if (planDetails) {
        const totalDays = planDetails.days.length;
        const curDay = active.currentDay || 1;
        const percent = Math.floor(((curDay - 1) / totalDays) * 100);
        
        if (activePlanTitle) activePlanTitle.textContent = planDetails.title;
        if (activePlanDesc) activePlanDesc.textContent = planDetails.description;
        if (activePlanPercent) activePlanPercent.textContent = `${percent}%`;
        if (activePlanDays) activePlanDays.textContent = `Day ${curDay}/${totalDays}`;
        if (activePlanProgress) activePlanProgress.style.width = `${percent}%`;
      }
    } else {
      if (activePlanTitle) activePlanTitle.textContent = state.settings.systemLanguage === 'vi' ? 'Chưa bắt đầu kế hoạch nào' : 'No Active Plan';
      if (activePlanDesc) activePlanDesc.textContent = state.settings.systemLanguage === 'vi' ? 'Hãy bắt đầu kế hoạch đọc trong tab Kế Hoạch.' : 'Start a reading plan from the Plans tab.';
      if (activePlanPercent) activePlanPercent.textContent = '0%';
      if (activePlanDays) activePlanDays.textContent = '0/0 Days';
      if (activePlanProgress) activePlanProgress.style.width = '0%';
    }

    // Last Highlighted Verse
    const lastHighlightText = document.getElementById('profile-last-highlight-text');
    const lastHighlightRef = document.getElementById('profile-last-highlight-ref');
    
    if (state.saved.highlights && state.saved.highlights.length > 0) {
      const lastH = state.saved.highlights[state.saved.highlights.length - 1];
      if (lastHighlightText) {
        lastHighlightText.textContent = `“${lastH.text}”`;
        if (lastH.color) {
          lastHighlightText.style.borderLeft = `3px solid var(--highlight-${lastH.color}, #F0AD4E)`;
          lastHighlightText.style.paddingLeft = '10px';
        }
      }
      if (lastHighlightRef) {
        lastHighlightRef.textContent = `${lastH.bookId} ${lastH.chapter}:${lastH.verseNum} (${lastH.translation})`;
      }
    } else {
      if (lastHighlightText) {
        lastHighlightText.textContent = state.settings.systemLanguage === 'vi' ? '“Chưa tô màu câu Kinh Thánh nào.”' : '“No highlights yet.”';
        lastHighlightText.style.borderLeft = '3px solid var(--border-color)';
        lastHighlightText.style.paddingLeft = '10px';
      }
      if (lastHighlightRef) {
        lastHighlightRef.textContent = state.settings.systemLanguage === 'vi' ? 'Nhấp chọn câu Kinh Thánh để tô màu' : 'Select a verse to apply colors';
      }
    }

    // Last Study Note
    const lastNoteText = document.getElementById('profile-last-note-text');
    const lastNoteRef = document.getElementById('profile-last-note-ref');

    if (state.saved.notes && state.saved.notes.length > 0) {
      const lastN = state.saved.notes[state.saved.notes.length - 1];
      if (lastNoteText) {
        lastNoteText.textContent = `“${lastN.noteText}”`;
      }
      if (lastNoteRef) {
        lastNoteRef.textContent = `${lastN.bookId} ${lastN.chapter}:${lastN.verseNum} — Ref: ${lastN.text.substring(0, 30)}...`;
      }
    } else {
      if (lastNoteText) {
        lastNoteText.textContent = state.settings.systemLanguage === 'vi' ? '“Chưa lưu ghi chú nào.”' : '“No notes saved yet.”';
      }
      if (lastNoteRef) {
        lastNoteRef.textContent = state.settings.systemLanguage === 'vi' ? 'Thêm ghi chú để lưu cảm nhận của bạn' : 'Add study notes to log observations';
      }
    }
  }

  document.getElementById('profile-save-btn').addEventListener('click', () => {
    const newN = document.getElementById('profile-input-name').value.trim();
    const newE = document.getElementById('profile-input-email').value.trim();
    if (!newN || !newE) return;

    state.profile.name = newN;
    state.profile.email = newE;
    saveState();
    showToast('Profile information saved.');
    
    // Rerender sidebar
    renderHomeView();
    renderProfileView();
  });

  // --- 15. SETTINGS PANEL PREFERENCES ---
  elements.notificationsCheckbox.addEventListener('change', (e) => {
    state.settings.notifications = e.target.checked;
    saveState();
    showToast(state.settings.notifications ? 'Daily notifications enabled' : 'Notifications disabled');
  });

  elements.offlineCheckbox.addEventListener('change', (e) => {
    state.settings.offline = e.target.checked;
    saveState();
    const offlineIndicator = document.getElementById('offline-status-indicator');
    if (offlineIndicator) {
      offlineIndicator.style.display = state.settings.offline ? 'inline' : 'none';
      const lang = state.settings.systemLanguage || 'en';
      offlineIndicator.textContent = lang === 'vi' ? '✓ Khả dụng ngoại tuyến' : '✓ Available Offline';
    }
  });

  // Quick Action Buttons router links
  document.querySelectorAll('.quick-action-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      if (action === 'read-bible') navigateTo('bible');
      else if (action === 'new-prayer') navigateTo('prayer');
      else if (action === 'view-saved') navigateTo('saved');
      else if (action === 'view-plans') navigateTo('plans');
    });
  });

  // Header settings button trigger
  elements.settingsTriggerBtn.addEventListener('click', () => {
    navigateTo('settings');
  });

  // --- 16. MODAL SYSTEM HELPERS ---
  function closeAllModals() {
    document.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  }

  // Click overlays to close
  document.querySelectorAll('.modal-overlay').forEach(over => {
    over.addEventListener('click', closeAllModals);
  });

  document.querySelectorAll('.modal-close-btn').forEach(btn => {
    btn.addEventListener('click', closeAllModals);
  });

  // Keyboard support: Escape closes overlays
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeAllModals();
      elements.searchDrawer.classList.remove('open');
    }
  });

  // Handle active session tab switches (Devotional / Scripture / Reflection)
  document.getElementById('btn-session-devo').addEventListener('click', () => setSessionTab(0));
  document.getElementById('btn-session-scripture').addEventListener('click', () => setSessionTab(1));
  document.getElementById('btn-session-reflect').addEventListener('click', () => setSessionTab(2));

  // VOTD trigger
  document.getElementById('votd-read-btn').addEventListener('click', () => {
    const list = window.BIBLE_DATA.votdList;
    const index = state.votdIndex !== undefined ? state.votdIndex : (new Date().getDate() % list.length);
    const item = list[index];
    if (item) {
      state.readerState.bookId = item.bookId;
      state.readerState.chapter = item.chapter;
      saveState();
      navigateTo('bible');
      renderBibleReader();
    }
  });

  document.getElementById('votd-bookmark-btn').addEventListener('click', () => {
    const list = window.BIBLE_DATA.votdList;
    const index = state.votdIndex !== undefined ? state.votdIndex : (new Date().getDate() % list.length);
    const item = list[index];
    if (item) {
      const trans = state.ui.selectedVersion || state.readerState.translation || 'WEB';
      const isVi = (trans === 'VIE' || trans === 'RVV11' || trans === 'NVB' || trans === 'BTT');
      
      let text = "";
      if (window.BIBLE_DATA.staticScriptures[trans] && window.BIBLE_DATA.staticScriptures[trans][item.bookId] && window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter]) {
        const verses = window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter];
        const verseObj = verses.find(v => v.num === item.verseNum);
        if (verseObj) text = verseObj.text;
      }
      if (!text) text = item.text[trans] || item.text['WEB'];

      state.saved.bookmarks.push({
        id: `b-votd-${Date.now()}`,
        bookId: item.bookId,
        chapter: item.chapter,
        verseNum: item.verseNum,
        text: text,
        translation: trans,
        time: 'Just now'
      });
      saveState();
      showToast('Verse of the day bookmarked.');
      
      // Update Saved View stats if active
      renderProfileView();
      renderSavedView();
    }
  });

  document.getElementById('votd-share-btn').addEventListener('click', () => {
    const list = window.BIBLE_DATA.votdList;
    const index = state.votdIndex !== undefined ? state.votdIndex : (new Date().getDate() % list.length);
    const item = list[index];
    if (item) {
      const trans = state.ui.selectedVersion || state.readerState.translation || 'WEB';
      const isVi = (trans === 'VIE' || trans === 'RVV11' || trans === 'NVB' || trans === 'BTT');
      
      let text = "";
      if (window.BIBLE_DATA.staticScriptures[trans] && window.BIBLE_DATA.staticScriptures[trans][item.bookId] && window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter]) {
        const verses = window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter];
        const verseObj = verses.find(v => v.num === item.verseNum);
        if (verseObj) text = verseObj.text;
      }
      if (!text) text = item.text[trans] || item.text['WEB'];
      const bookName = isVi ? item.bookName['Tiếng Việt'] : item.bookName['English'];

      document.getElementById('share-card-text').textContent = `“${text}”`;
      document.getElementById('share-card-ref').textContent = `${bookName} ${item.chapter}:${item.verseNum} (${trans})`;
      elements.shareCardModal.style.display = 'flex';
    }
  });

  // Cycle VOTD buttons
  document.getElementById('votd-prev-btn').addEventListener('click', () => {
    const list = window.BIBLE_DATA.votdList;
    if (state.votdIndex === undefined) {
      state.votdIndex = (new Date().getDate() % list.length);
    }
    state.votdIndex = (state.votdIndex - 1 + list.length) % list.length;
    saveState();
    renderVotd();
  });

  document.getElementById('votd-next-btn').addEventListener('click', () => {
    const list = window.BIBLE_DATA.votdList;
    if (state.votdIndex === undefined) {
      state.votdIndex = (new Date().getDate() % list.length);
    }
    state.votdIndex = (state.votdIndex + 1) % list.length;
    saveState();
    renderVotd();
  });

  // Typography controls: Version Select dropdown
  const votdVersionSelect = document.getElementById('votd-version-select');
  if (votdVersionSelect) {
    votdVersionSelect.addEventListener('change', (e) => {
      state.ui.selectedVersion = e.target.value;
      saveState();
      renderVotd();
    });
  }

  // Typography controls: Font Size slider
  const votdFontSizeSlider = document.getElementById('votd-font-size-slider');
  if (votdFontSizeSlider) {
    votdFontSizeSlider.addEventListener('input', (e) => {
      state.ui.bibleFontSize = parseInt(e.target.value);
      saveState();
      renderVotd();
    });
  }

  // Typography controls: Serif/Sans-serif font toggle
  const votdFontToggleBtn = document.getElementById('votd-font-toggle-btn');
  if (votdFontToggleBtn) {
    votdFontToggleBtn.addEventListener('click', () => {
      state.ui.bibleFontSerif = !state.ui.bibleFontSerif;
      saveState();
      renderVotd();
    });
  }

  // Quick Annotations: Highlight palette toggle button
  const votdHighlightBtn = document.getElementById('votd-highlight-btn');
  const votdHighlightPalette = document.getElementById('votd-highlight-palette');
  if (votdHighlightBtn && votdHighlightPalette) {
    votdHighlightBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = votdHighlightPalette.style.display === 'flex';
      votdHighlightPalette.style.display = isVisible ? 'none' : 'flex';
      // Close other popover if open
      const votdNotePopover = document.getElementById('votd-note-popover');
      if (votdNotePopover) votdNotePopover.style.display = 'none';
    });
  }

  // Quick Annotations: Palette colors selection
  document.querySelectorAll('#votd-highlight-palette .palette-color').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const color = btn.getAttribute('data-color');
      state.ui.highlightColor = color === 'clear' ? null : color;
      saveState();
      renderVotd();
      if (color !== 'clear') {
        const list = window.BIBLE_DATA.votdList;
        const index = state.votdIndex !== undefined ? state.votdIndex : (new Date().getDate() % list.length);
        const item = list[index];
        if (item) {
          const trans = state.ui.selectedVersion || state.readerState.translation || 'WEB';
          let text = "";
          if (window.BIBLE_DATA.staticScriptures[trans] && window.BIBLE_DATA.staticScriptures[trans][item.bookId] && window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter]) {
            const verses = window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter];
            const verseObj = verses.find(v => v.num === item.verseNum);
            if (verseObj) text = verseObj.text;
          }
          if (!text) text = item.text[trans] || item.text['WEB'];
          publishCommunityFeedPost(`đã tô màu ${item.bookId} ${item.chapter}:${item.verseNum} bằng bản dịch ${trans}`, `“${text}”`);
        }
      }
      if (votdHighlightPalette) votdHighlightPalette.style.display = 'none';
      showToast(color === 'clear' ? 'Highlight removed.' : `${color.charAt(0).toUpperCase() + color.slice(1)} highlight applied.`);
    });
  });

  // Quick Annotations: Note popup toggle button
  const votdNoteBtn = document.getElementById('votd-note-btn');
  const votdNotePopover = document.getElementById('votd-note-popover');
  if (votdNoteBtn && votdNotePopover) {
    votdNoteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isVisible = votdNotePopover.style.display === 'flex';
      votdNotePopover.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        document.getElementById('votd-quick-note-text').focus();
      }
      // Close highlight palette if open
      if (votdHighlightPalette) votdHighlightPalette.style.display = 'none';
    });
  }

  // Quick Annotations: Cancel note button
  const votdNoteCancel = document.getElementById('votd-note-cancel');
  if (votdNoteCancel && votdNotePopover) {
    votdNoteCancel.addEventListener('click', (e) => {
      e.stopPropagation();
      votdNotePopover.style.display = 'none';
    });
  }

  // Quick Annotations: Save note button
  const votdNoteSave = document.getElementById('votd-note-save');
  if (votdNoteSave && votdNotePopover) {
    votdNoteSave.addEventListener('click', (e) => {
      e.stopPropagation();
      const list = window.BIBLE_DATA.votdList;
      const index = state.votdIndex !== undefined ? state.votdIndex : (new Date().getDate() % list.length);
      const item = list[index];
      const noteInput = document.getElementById('votd-quick-note-text');
      if (item && noteInput) {
        const noteText = noteInput.value.trim();
        if (!noteText) {
          showToast('Please enter note content.');
          return;
        }

        const trans = state.ui.selectedVersion || state.readerState.translation || 'WEB';
        let text = "";
        if (window.BIBLE_DATA.staticScriptures[trans] && window.BIBLE_DATA.staticScriptures[trans][item.bookId] && window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter]) {
          const verses = window.BIBLE_DATA.staticScriptures[trans][item.bookId][item.chapter];
          const verseObj = verses.find(v => v.num === item.verseNum);
          if (verseObj) text = verseObj.text;
        }
        if (!text) text = item.text[trans] || item.text['WEB'];

        state.ui.quickNote = ''; // reset local quickNote
        state.saved.notes.push({
          id: `n-votd-${Date.now()}`,
          bookId: item.bookId,
          chapter: item.chapter,
          verseNum: item.verseNum,
          text: text,
          noteText: noteText,
          translation: trans,
          time: 'Just now'
        });
        saveState();
        publishCommunityFeedPost(`đã viết ghi chú cho ${item.bookId} ${item.chapter}:${item.verseNum}`, noteText);
        showToast('Study note saved successfully!');
        noteInput.value = '';
        votdNotePopover.style.display = 'none';
        renderVotd();
        renderProfileView();
        renderSavedView();
      }
    });
  }

  // Close popovers if clicking anywhere else in the document
  document.addEventListener('click', () => {
    if (votdHighlightPalette) votdHighlightPalette.style.display = 'none';
    if (votdNotePopover) votdNotePopover.style.display = 'none';
  });

  // --- DAILY DEVOTIONAL AUDIO PLAYBACK WIDGET ---
  let devoAudioInterval = null;
  let devoAudioDuration = 90; // 1 min 30 seconds
  let devoAudioCurrentTime = 0;
  let devoAudioPlaying = false;

  function updateDevoAudioUI() {
    const playIcon = document.getElementById('devo-play-icon');
    const pauseIcon = document.getElementById('devo-pause-icon');
    const progressFill = document.getElementById('devo-audio-progress-fill');
    const timeText = document.getElementById('devo-audio-time');

    if (playIcon && pauseIcon) {
      playIcon.style.display = devoAudioPlaying ? 'none' : 'block';
      pauseIcon.style.display = devoAudioPlaying ? 'block' : 'none';
    }

    if (progressFill) {
      const percentage = (devoAudioCurrentTime / devoAudioDuration) * 100;
      progressFill.style.width = `${percentage}%`;
    }

    if (timeText) {
      const formatTime = (secs) => {
        const m = Math.floor(secs / 60);
        const s = Math.floor(secs % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
      };
      timeText.textContent = `${formatTime(devoAudioCurrentTime)} / ${formatTime(devoAudioDuration)}`;
    }
  }

  function playDevoAudio() {
    if (devoAudioPlaying) return;
    devoAudioPlaying = true;
    updateDevoAudioUI();

    devoAudioInterval = setInterval(() => {
      devoAudioCurrentTime += 1;
      if (devoAudioCurrentTime >= devoAudioDuration) {
        pauseDevoAudio();
        devoAudioCurrentTime = 0;
      }
      updateDevoAudioUI();
    }, 1000);
  }

  function pauseDevoAudio() {
    if (!devoAudioPlaying) return;
    devoAudioPlaying = false;
    clearInterval(devoAudioInterval);
    updateDevoAudioUI();
  }

  // Click delegation for devotional audio elements
  document.addEventListener('click', (e) => {
    const playBtn = e.target.closest('#devo-audio-play-btn');
    if (playBtn) {
      e.stopPropagation();
      if (devoAudioPlaying) {
        pauseDevoAudio();
      } else {
        playDevoAudio();
      }
      return;
    }

    const track = e.target.closest('#devo-audio-progress-track');
    if (track) {
      e.stopPropagation();
      const rect = track.getBoundingClientRect();
      const offsetX = e.clientX - rect.left;
      const percentage = offsetX / rect.width;
      devoAudioCurrentTime = Math.max(0, Math.min(devoAudioDuration, Math.floor(percentage * devoAudioDuration)));
      updateDevoAudioUI();
    }
  });


  // --- MEETINGS VIEW RENDER ---
  let activeMeetingsFilter = 'all';
  let editingMeetingId = null;

  function renderMeetingsView() {
    const container = document.getElementById('meetings-grid-container');
    container.innerHTML = '';

    const list = state.meetings || [];
    const filtered = list.filter(m => activeMeetingsFilter === 'all' || (activeMeetingsFilter === 'live' && m.isLive));

    const isVi = (state.settings.systemLanguage === 'vi');

    if (filtered.length === 0) {
      container.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:var(--text-muted); margin:40px 0;">${isVi ? 'Không có phòng thông công nào khớp với bộ lọc này.' : 'No fellowship rooms match this filter.'}</p>`;
      return;
    }

    filtered.forEach(m => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.padding = '24px';
      
      const isRec = m.isRecurring || m.time.startsWith('🔄');
      const badge = m.isLive 
        ? `<span class="card-tag" style="background-color:rgba(92,184,92,0.15); color:#5CB85C; border:1px solid rgba(92,184,92,0.3); font-weight:800; display:inline-flex; align-items:center; gap:6px;">
            <span style="width:8px; height:8px; border-radius:50%; background-color:#5CB85C; display:inline-block; animation: pulse 1.5s infinite;"></span> ${isVi ? 'Đang Diễn Ra' : 'Live Now'}
           </span>`
        : `<span class="card-tag" style="background-color:${isRec ? 'rgba(83,105,118,0.12)' : 'var(--bg-primary)'}; color:${isRec ? 'var(--accent-color)' : 'var(--text-secondary)'}; font-weight: 600;">${translateMeetingTime(m.time)}</span>`;

      const isMyMeeting = (m.host === state.profile.name);
      const actionButton = isMyMeeting
        ? `<div style="display:flex; gap:10px; margin-top:auto; width:100%;">
            <a href="${m.link}" target="_blank" class="btn ${m.isLive ? 'btn-primary' : 'btn-secondary'}" style="flex-grow:1; text-align:center; padding:10px 0; font-size:13px; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">
              ${m.isLive ? (isVi ? 'Tham gia' : 'Join') : (isVi ? 'Mở phòng' : 'Open Link')}
            </a>
            <button class="btn btn-secondary btn-icon-only btn-adjust-meeting" data-id="${m.id}" style="padding:0 12px; display:inline-flex; align-items:center; justify-content:center;" title="${isVi ? 'Chỉnh sửa' : 'Adjust'}">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 1 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
            </button>
            <button class="btn btn-secondary btn-icon-only btn-delete-meeting" data-id="${m.id}" style="padding:0 12px; display:inline-flex; align-items:center; justify-content:center; color:#D9534F;" title="${isVi ? 'Xóa' : 'Delete'}">
              <svg viewBox="0 0 24 24" width="16" height="16" stroke="currentColor" fill="none" stroke-width="2"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
            </button>
           </div>`
        : `<a href="${m.link}" target="_blank" class="btn ${m.isLive ? 'btn-primary' : 'btn-secondary'}" style="width:100%; text-align:center; padding:10px 0; font-size:13px; font-weight:700; margin-top:auto;">
            ${m.isLive ? (isVi ? 'Tham gia trên Zoom' : 'Join Meeting on Zoom') : (isVi ? 'Mở liên kết phòng' : 'Open Fellowship link')}
          </a>`;

      card.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:12px;">
          ${badge}
          <span style="font-size:11px; color:var(--text-muted); font-weight:700;">${m.duration} ${isVi ? 'PHÚT' : 'MINS'}</span>
        </div>
        <h3 style="font-size:16px; margin-bottom:8px;">${m.title}</h3>
        <p style="font-size:12px; color:var(--text-secondary); margin-bottom:20px; line-height:1.5;">${m.desc}</p>
        
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:20px; margin-top:auto;">
          <img src="${m.avatar}" style="width:28px; height:28px; border-radius:50%; object-fit:cover;">
          <span style="font-size:12px; color:var(--text-muted);">${isVi ? 'Chủ trì' : 'Host'}: <strong>${m.host}</strong></span>
        </div>

        ${actionButton}
      `;
      container.appendChild(card);
    });

    // Bind adjust and delete buttons
    container.querySelectorAll('.btn-delete-meeting').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        if (confirm(isVi ? 'Bạn có chắc chắn muốn xóa phòng thông công này?' : 'Are you sure you want to delete this fellowship room?')) {
          state.meetings = state.meetings.filter(m => m.id !== id);
          saveState();
          renderMeetingsView();
          showToast(isVi ? 'Đã xóa phòng thông công.' : 'Fellowship room deleted.');
        }
      });
    });

    container.querySelectorAll('.btn-adjust-meeting').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const id = btn.getAttribute('data-id');
        const m = state.meetings.find(x => x.id === id);
        if (!m) return;

        editingMeetingId = m.id;
        
        document.getElementById('zoom-input-title').value = m.title;
        document.getElementById('zoom-input-desc').value = m.desc;
        document.getElementById('zoom-input-link').value = m.link;

        if (m.isRecurring) {
          setScheduleSegment('recurring');
          const timePart = m.time.replace('🔄 ', '');
          const parts = timePart.split(' at ');
          const day = parts[0] || 'Every Sunday';
          const rTime = parts[1] || '7:00 PM';
          document.getElementById('zoom-input-recurrence-day').value = day;
          document.getElementById('zoom-input-recurrence-time').value = rTime;
        } else {
          setScheduleSegment('one-time');
          document.getElementById('zoom-input-time').value = m.time.replace('📅 ', '');
          document.getElementById('zoom-input-duration').value = m.duration;
        }

        elements.zoomCreateModal.style.display = 'flex';
      });
    });
  }

  // Filter Buttons for Meetings
  document.getElementById('filter-meetings-all').addEventListener('click', () => {
    document.getElementById('filter-meetings-all').classList.add('active');
    document.getElementById('filter-meetings-live').classList.remove('active');
    activeMeetingsFilter = 'all';
    renderMeetingsView();
  });

  document.getElementById('filter-meetings-live').addEventListener('click', () => {
    document.getElementById('filter-meetings-all').classList.remove('active');
    document.getElementById('filter-meetings-live').classList.add('active');
    activeMeetingsFilter = 'live';
    renderMeetingsView();
  });

  // Helper to switch schedule segmented control
  function setScheduleSegment(type) {
    const btnOneTime = document.getElementById('segment-one-time');
    const btnRecurring = document.getElementById('segment-recurring');
    const hiddenInput = document.getElementById('zoom-input-schedule-type');
    const oneTimeFields = document.getElementById('zoom-schedule-one-time-fields');
    const recurringFields = document.getElementById('zoom-schedule-recurring-fields');

    hiddenInput.value = type;

    if (type === 'recurring') {
      btnRecurring.style.backgroundColor = 'var(--accent-color)';
      btnRecurring.style.color = 'var(--accent-text)';
      btnRecurring.style.border = 'none';
      btnRecurring.style.boxShadow = '0 4px 12px rgba(92,110,88,0.2)';

      btnOneTime.style.backgroundColor = 'transparent';
      btnOneTime.style.color = 'var(--text-muted)';
      btnOneTime.style.border = '1px solid var(--border-color)';
      btnOneTime.style.boxShadow = 'none';

      oneTimeFields.style.display = 'none';
      recurringFields.style.display = 'grid';
    } else {
      btnOneTime.style.backgroundColor = 'var(--accent-color)';
      btnOneTime.style.color = 'var(--accent-text)';
      btnOneTime.style.border = 'none';
      btnOneTime.style.boxShadow = '0 4px 12px rgba(92,110,88,0.2)';

      btnRecurring.style.backgroundColor = 'transparent';
      btnRecurring.style.color = 'var(--text-muted)';
      btnRecurring.style.border = '1px solid var(--border-color)';
      btnRecurring.style.boxShadow = 'none';

      oneTimeFields.style.display = 'grid';
      recurringFields.style.display = 'none';
    }
  }

  // Handle segmented button clicks
  document.getElementById('segment-one-time').addEventListener('click', () => setScheduleSegment('one-time'));
  document.getElementById('segment-recurring').addEventListener('click', () => setScheduleSegment('recurring'));

  // Modal creation bindings
  document.getElementById('btn-create-meeting-trigger').addEventListener('click', () => {
    editingMeetingId = null; // Clear edit tracking
    // Clear inputs
    document.getElementById('zoom-input-title').value = '';
    document.getElementById('zoom-input-desc').value = '';
    document.getElementById('zoom-input-time').value = 'Today at ' + new Date(Date.now() + 3600000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
    document.getElementById('zoom-input-recurrence-time').value = '7:00 PM';
    document.getElementById('zoom-input-link').value = '';
    
    // Reset segmented control to one-time default
    setScheduleSegment('one-time');
    
    elements.zoomCreateModal.style.display = 'flex';
  });

  document.getElementById('zoom-save-btn').addEventListener('click', () => {
    const title = document.getElementById('zoom-input-title').value.trim();
    const desc = document.getElementById('zoom-input-desc').value.trim();
    const scheduleType = document.getElementById('zoom-input-schedule-type').value;
    let link = document.getElementById('zoom-input-link').value.trim();
    
    let time = '';
    let duration = 60;
    let isRecurring = false;
    let isLive = false;

    if (scheduleType === 'recurring') {
      const recurrenceDay = document.getElementById('zoom-input-recurrence-day').value;
      const recurrenceTime = document.getElementById('zoom-input-recurrence-time').value.trim();
      if (!title || !desc || !recurrenceTime) {
        showToast('Please fill out all required fields', 'warning');
        return;
      }
      time = `🔄 ${recurrenceDay} at ${recurrenceTime}`;
      isRecurring = true;
    } else {
      const rawTime = document.getElementById('zoom-input-time').value.trim();
      duration = parseInt(document.getElementById('zoom-input-duration').value);
      if (!title || !desc || !rawTime) {
        showToast('Please fill out all required fields', 'warning');
        return;
      }
      isLive = rawTime.toLowerCase().includes('live') || rawTime.toLowerCase().includes('now');
      time = isLive ? 'Live Now' : `📅 ${rawTime}`;
    }

    if (!link) {
      const randId = Math.floor(100000000 + Math.random() * 900000000);
      const randPwd = Math.random().toString(36).substring(2, 8);
      link = `https://zoom.us/j/${randId}?pwd=${randPwd}`;
    }

    if (editingMeetingId) {
      const idx = state.meetings.findIndex(m => m.id === editingMeetingId);
      if (idx !== -1) {
        state.meetings[idx] = {
          ...state.meetings[idx],
          title,
          desc,
          time,
          duration,
          isLive,
          isRecurring,
          link
        };
        showToast(isVi ? 'Đã điều chỉnh phòng thông công!' : 'Zoom fellowship room adjusted!');
      }
      editingMeetingId = null;
    } else {
      const newMeeting = {
        id: `zoom-${Date.now()}`,
        title,
        desc,
        host: state.profile.name,
        avatar: state.profile.avatar,
        time,
        duration,
        isLive,
        isRecurring,
        link
      };

      state.meetings = state.meetings || [];
      state.meetings.unshift(newMeeting);

      // Share to community feed
      state.community.feed.unshift({
        id: `feed-zoom-${Date.now()}`,
        author: state.profile.name,
        avatar: state.profile.avatar,
        type: 'zoom',
        detail: `scheduled a Fellowship Room: "${title}"`,
        text: `${isRecurring ? 'Recurring schedule' : 'One-time meeting'} set for ${time} (${duration} mins). Description: "${desc}"`,
        time: 'Just now',
        likes: 0,
        likedByMe: false,
        comments: []
      });
      showToast(isVi ? 'Đã lên lịch phòng thông công!' : 'Zoom fellowship room scheduled!');
    }

    saveState();
    closeAllModals();
    renderMeetingsView();
  });

  // 3D Tumbler Picker scroll event handler
  const tumblerWheel = document.getElementById('zoom-tumbler-wheel');
  if (tumblerWheel) {
    const tumblerItems = tumblerWheel.querySelectorAll('.tumbler-item');
    const recurrenceDayInput = document.getElementById('zoom-input-recurrence-day');
    
    const centerActiveItem = () => {
      const val = recurrenceDayInput.value;
      const activeItem = Array.from(tumblerItems).find(item => item.getAttribute('data-value') === val);
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    };

    const updateTumbler = () => {
      const wheelRect = tumblerWheel.getBoundingClientRect();
      if (wheelRect.height === 0) return; // not visible yet
      const wheelCenter = wheelRect.top + wheelRect.height / 2;

      let closestItem = null;
      let minDiff = Infinity;

      tumblerItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const diff = Math.abs(itemCenter - wheelCenter);

        if (diff < minDiff) {
          minDiff = diff;
          closestItem = item;
        }

        // Calculate normalized distance from center (-1.0 to 1.0)
        const distanceFromCenter = (itemCenter - wheelCenter) / (wheelRect.height / 2);
        const absDist = Math.abs(distanceFromCenter);

        // Apply 3D rotation and cylinder distortion
        const angle = distanceFromCenter * 40; // rotate maximum of 40 degrees
        const scale = 1 - absDist * 0.12;       // scale down slightly at edge
        const opacity = 1 - absDist * 0.6;      // fade out text towards edges

        item.style.transform = `rotateX(${angle}deg) scale(${scale})`;
        item.style.opacity = opacity;

        if (absDist < 0.25) {
          item.style.color = '#FFFFFF';
          item.style.fontWeight = '700';
        } else {
          item.style.color = 'var(--text-muted)';
          item.style.fontWeight = '500';
        }
      });

      if (closestItem) {
        recurrenceDayInput.value = closestItem.getAttribute('data-value');
      }
    };

    tumblerWheel.addEventListener('scroll', updateTumbler);
    
    // When mouse enters, make sure the active item is centered
    tumblerWheel.parentElement.addEventListener('mouseenter', () => {
      setTimeout(() => {
        centerActiveItem();
        updateTumbler();
      }, 50);
    });
    
    // Trigger scroll computation initially when modal opens
    document.getElementById('btn-create-meeting-trigger').addEventListener('click', () => {
      setTimeout(() => {
        centerActiveItem();
        updateTumbler();
      }, 150);
    });
    
    // Also trigger on segmented toggle switch when picker becomes visible
    document.getElementById('segment-recurring').addEventListener('click', () => {
      setTimeout(() => {
        centerActiveItem();
        updateTumbler();
      }, 150);
    });
  }

  // 3D Tumbler Picker for Duration scroll event handler
  const durationWheel = document.getElementById('zoom-duration-tumbler-wheel');
  if (durationWheel) {
    const durationItems = durationWheel.querySelectorAll('.tumbler-item');
    const durationInput = document.getElementById('zoom-input-duration');
    const centerActiveDuration = () => {
      const val = durationInput.value;
      const activeItem = Array.from(durationItems).find(item => item.getAttribute('data-value') === val);
      if (activeItem) {
        activeItem.scrollIntoView({ block: 'center', behavior: 'auto' });
      }
    };

    const updateDurationTumbler = () => {
      const wheelRect = durationWheel.getBoundingClientRect();
      if (wheelRect.height === 0) return;
      const wheelCenter = wheelRect.top + wheelRect.height / 2;

      let closestItem = null;
      let minDiff = Infinity;

      durationItems.forEach(item => {
        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const diff = Math.abs(itemCenter - wheelCenter);

        if (diff < minDiff) {
          minDiff = diff;
          closestItem = item;
        }

        const distanceFromCenter = (itemCenter - wheelCenter) / (wheelRect.height / 2);
        const absDist = Math.abs(distanceFromCenter);

        const angle = distanceFromCenter * 40;
        const scale = 1 - absDist * 0.12;
        const opacity = 1 - absDist * 0.6;

        item.style.transform = `rotateX(${angle}deg) scale(${scale})`;
        item.style.opacity = opacity;

        if (absDist < 0.25) {
          item.style.color = '#FFFFFF';
          item.style.fontWeight = '700';
        } else {
          item.style.color = 'var(--text-muted)';
          item.style.fontWeight = '500';
        }
      });

      if (closestItem) {
        durationInput.value = closestItem.getAttribute('data-value');
      }
    };

    durationWheel.addEventListener('scroll', updateDurationTumbler);

    durationWheel.parentElement.addEventListener('mouseenter', () => {
      setTimeout(() => {
        centerActiveDuration();
        updateDurationTumbler();
      }, 50);
    });

    document.getElementById('btn-create-meeting-trigger').addEventListener('click', () => {
      durationInput.value = '60'; // Default duration
      setTimeout(() => {
        centerActiveDuration();
        updateDurationTumbler();
      }, 150);
    });

    document.getElementById('segment-one-time').addEventListener('click', () => {
      setTimeout(() => {
        centerActiveDuration();
        updateDurationTumbler();
      }, 150);
    });
  }

  // --- CUSTOM CIRCULAR CLOCK TIME PICKER SYSTEM ---
  let selectedHour = 7;
  let selectedMinute = 0;
  let selectedAmPm = 'PM';
  let clockMode = 'hour'; // 'hour' or 'minute'
  let activeClockInput = null;

  const clockPopover = document.getElementById('zoom-clock-picker-popover');
  const clockSvg = document.getElementById('zoom-clock-svg');
  const svgContainer = document.getElementById('zoom-clock-svg-container');
  const btnModeHour = document.getElementById('zoom-clock-mode-hour');
  const btnModeMinute = document.getElementById('zoom-clock-mode-minute');

  function drawClockNumbers(mode) {
    const numbersGroup = document.getElementById('zoom-clock-numbers');
    if (!numbersGroup) return;
    numbersGroup.innerHTML = '';
    
    const count = 12;
    const cx = 85;
    const cy = 85;
    
    if (mode === 'hour') {
      // Draw Outer Ring (AM: 1 to 12) at R = 64
      for (let i = 1; i <= count; i++) {
        const val = i;
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = cx + 64 * Math.cos(angle);
        const y = cy + 64 * Math.sin(angle);
        
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('style', 'font-weight:700; user-select:none; pointer-events:none;');
        textEl.setAttribute('fill', 'var(--text-secondary)');
        textEl.setAttribute('font-size', '10');
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'central');
        textEl.textContent = val;
        
        numbersGroup.appendChild(textEl);
      }
      
      // Draw Inner Ring (PM: 13 to 24) at R = 42
      for (let i = 1; i <= count; i++) {
        const val = i + 12;
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = cx + 42 * Math.cos(angle);
        const y = cy + 42 * Math.sin(angle);
        
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('style', 'font-weight:700; user-select:none; pointer-events:none;');
        textEl.setAttribute('fill', 'var(--text-muted)');
        textEl.setAttribute('font-size', '9');
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'central');
        textEl.textContent = val;
        
        numbersGroup.appendChild(textEl);
      }
    } else {
      // Draw Minutes (00 to 55) at R = 64
      for (let i = 1; i <= count; i++) {
        const val = i === 12 ? '00' : String(i * 5).padStart(2, '0');
        const angle = (i * 30 - 90) * Math.PI / 180;
        const x = cx + 64 * Math.cos(angle);
        const y = cy + 64 * Math.sin(angle);
        
        const textEl = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.setAttribute('style', 'font-weight:700; user-select:none; pointer-events:none;');
        textEl.setAttribute('fill', 'var(--text-secondary)');
        textEl.setAttribute('font-size', '10');
        textEl.setAttribute('text-anchor', 'middle');
        textEl.setAttribute('dominant-baseline', 'central');
        textEl.textContent = val;
        
        numbersGroup.appendChild(textEl);
      }
    }
  }

  function setClockMode(mode) {
    clockMode = mode;
    if (mode === 'hour') {
      if (btnModeHour) {
        btnModeHour.style.backgroundColor = 'var(--accent-color)';
        btnModeHour.style.color = 'var(--accent-text)';
        btnModeHour.style.border = 'none';
      }
      if (btnModeMinute) {
        btnModeMinute.style.backgroundColor = 'transparent';
        btnModeMinute.style.color = 'var(--text-muted)';
        btnModeMinute.style.border = '1px solid var(--border-color)';
      }
    } else {
      if (btnModeMinute) {
        btnModeMinute.style.backgroundColor = 'var(--accent-color)';
        btnModeMinute.style.color = 'var(--accent-text)';
        btnModeMinute.style.border = 'none';
      }
      if (btnModeHour) {
        btnModeHour.style.backgroundColor = 'transparent';
        btnModeHour.style.color = 'var(--text-muted)';
        btnModeHour.style.border = '1px solid var(--border-color)';
      }
    }
    drawClockNumbers(mode);
    updateClockHand();
  }

  function updateClockHand() {
    const hand = document.getElementById('zoom-clock-hand');
    const handDot = document.getElementById('zoom-clock-hand-dot');
    if (!hand || !handDot) return;
    
    let radius = 58;
    let angle = 0;
    
    if (clockMode === 'hour') {
      if (selectedHour <= 12) {
        radius = 58;
        angle = (selectedHour % 12) * 30;
      } else {
        radius = 38;
        angle = ((selectedHour - 12) % 12) * 30;
      }
    } else {
      radius = 58;
      angle = selectedMinute * 6; // Snaps hand smoothly to individual minutes
    }
    
    const theta = (angle - 90) * Math.PI / 180;
    const x2 = 85 + radius * Math.cos(theta);
    const y2 = 85 + radius * Math.sin(theta);
    
    hand.setAttribute('x2', x2);
    hand.setAttribute('y2', y2);
    handDot.setAttribute('cx', x2);
    handDot.setAttribute('cy', y2);
  }

  function updateClockDisplay() {
    let ampm = 'AM';
    let displayHour = selectedHour;
    
    if (selectedHour === 24) {
      displayHour = 12;
      ampm = 'AM';
    } else if (selectedHour === 12) {
      displayHour = 12;
      ampm = 'PM';
    } else if (selectedHour > 12) {
      displayHour = selectedHour - 12;
      ampm = 'PM';
    } else {
      ampm = 'AM';
    }
    
    const formatted = `${displayHour}:${String(selectedMinute).padStart(2, '0')} ${ampm}`;
    const display = document.getElementById('zoom-clock-display');
    if (display) display.textContent = formatted;
    
    if (activeClockInput) {
      if (activeClockInput.id === 'zoom-input-time') {
        const val = activeClockInput.value;
        const prefix = val.includes('at ') ? val.split('at ')[0] + 'at ' : 'Today at ';
        activeClockInput.value = prefix + formatted;
      } else {
        activeClockInput.value = formatted;
      }
    }
  }

  let isClockDragging = false;

  function handleClockInteraction(clientX, clientY) {
    const rect = clockSvg.getBoundingClientRect();
    const clickX = clientX - rect.left;
    const clickY = clientY - rect.top;
    
    const dx = clickX - 85;
    const dy = clickY - 85;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    let angle = Math.atan2(dy, dx) * 180 / Math.PI;
    angle = (angle + 90 + 360) % 360;
    
    if (clockMode === 'hour') {
      const step = Math.round(angle / 30) % 12;
      const hrVal = step === 0 ? 12 : step;
      if (distance <= 52) {
        selectedHour = hrVal + 12;
      } else {
        selectedHour = hrVal;
      }
    } else {
      // Snaps to nearest minute (0 to 59)
      selectedMinute = Math.round((angle / 360) * 60) % 60;
    }
    updateClockHand();
    updateClockDisplay();
  }

  if (clockSvg) {
    clockSvg.addEventListener('mousedown', (e) => {
      e.preventDefault();
      isClockDragging = true;
      handleClockInteraction(e.clientX, e.clientY);
    });

    document.addEventListener('mousemove', (e) => {
      if (isClockDragging) {
        handleClockInteraction(e.clientX, e.clientY);
      }
    });

    document.addEventListener('mouseup', () => {
      if (isClockDragging) {
        isClockDragging = false;
        if (clockMode === 'hour') {
          setClockMode('minute');
          updateClockHand();
          updateClockDisplay();
        }
      }
    });

    // Touch support
    clockSvg.addEventListener('touchstart', (e) => {
      e.preventDefault();
      isClockDragging = true;
      const touch = e.touches[0];
      handleClockInteraction(touch.clientX, touch.clientY);
    }, { passive: false });

    document.addEventListener('touchmove', (e) => {
      if (isClockDragging) {
        const touch = e.touches[0];
        handleClockInteraction(touch.clientX, touch.clientY);
      }
    }, { passive: false });

    document.addEventListener('touchend', () => {
      if (isClockDragging) {
        isClockDragging = false;
        if (clockMode === 'hour') {
          setClockMode('minute');
          updateClockHand();
          updateClockDisplay();
        }
      }
    });
  }

  if (btnModeHour) btnModeHour.addEventListener('click', () => setClockMode('hour'));
  if (btnModeMinute) btnModeMinute.addEventListener('click', () => setClockMode('minute'));

  function showClockPicker(inputEl) {
    activeClockInput = inputEl;
    
    const val = inputEl.value;
    const timeMatch = val.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (timeMatch) {
      const hr = parseInt(timeMatch[1]);
      const min = parseInt(timeMatch[2]);
      const ampm = timeMatch[3].toUpperCase();
      
      selectedMinute = min;
      if (ampm === 'AM') {
        selectedHour = hr === 12 ? 24 : hr;
      } else {
        selectedHour = hr === 12 ? 12 : hr + 12;
      }
    }
    
    setClockMode('hour');
    updateClockDisplay();
    
    if (clockPopover) {
      // Position popover right under the input field inside modal content
      const inputRect = inputEl.getBoundingClientRect();
      const modalContent = document.querySelector('#zoom-create-modal .modal-content');
      if (modalContent) {
        const modalRect = modalContent.getBoundingClientRect();
        clockPopover.style.top = `${inputRect.bottom - modalRect.top + 8}px`;
        clockPopover.style.left = `${inputRect.left - modalRect.left}px`;
      }
      clockPopover.style.display = 'flex';
    }
  }

  // Hook input focus and click events
  const inputTime = document.getElementById('zoom-input-time');
  const inputRecurrenceTime = document.getElementById('zoom-input-recurrence-time');

  if (inputTime) {
    inputTime.addEventListener('focus', () => showClockPicker(inputTime));
    inputTime.addEventListener('click', () => showClockPicker(inputTime));
  }

  if (inputRecurrenceTime) {
    inputRecurrenceTime.addEventListener('focus', () => showClockPicker(inputRecurrenceTime));
    inputRecurrenceTime.addEventListener('click', () => showClockPicker(inputRecurrenceTime));
  }

  // Close clock picker when clicking outside
  document.addEventListener('click', (e) => {
    if (clockPopover && clockPopover.style.display === 'flex') {
      if (!clockPopover.contains(e.target) && 
          e.target !== inputTime && 
          e.target !== inputRecurrenceTime) {
        clockPopover.style.display = 'none';
      }
    }
  });

  // --- AUTHENTICATION STATE & ROUTING FLOW ---
  function showAuthScreen() {
    document.getElementById('auth-container').style.display = 'flex';
    document.getElementById('app').style.display = 'none';
  }

  function hideAuthScreen() {
    document.getElementById('auth-container').style.display = 'none';
    document.getElementById('app').style.display = 'flex';
  }

  function initAuthState() {
    const token = localStorage.getItem('aurabible_token');
    const isGuest = localStorage.getItem('aurabible_guest') === 'true';

    if (token) {
      hideAuthScreen();
      fetchUserState(token);
    } else if (isGuest) {
      hideAuthScreen();
      loadState();
      // Initialize or reset default local state profile for guest
      if (!state.profile || !state.profile.name || state.profile.name === 'Elijah Sterling' || state.profile.name === 'Loading...') {
        state.profile = {
          name: 'Guest User',
          email: 'guest@aurabible.app',
          avatar: 'https://api.dicebear.com/7.x/adventurer/svg?seed=guest',
          streak: 0,
          joinedDate: 'Today'
        };
        saveState();
      }
      verifyStreakValidity();
      applyTheme();
      applyLanguage();
      navigateTo('home');
    } else {
      showAuthScreen();
    }
  }

  function fetchUserState(token) {
    fetch(API_BASE + '/api/user/state', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(res => {
      if (res.status === 401 || res.status === 403) {
        logout();
        throw new Error('Session expired');
      }
      return res.json();
    })
    .then(data => {
      // Load settings and profile from server db, preserving defaults if null
      state = {
        ...DEFAULT_STATE,
        ...data,
        settings: data.settings || DEFAULT_STATE.settings,
        ui: { ...DEFAULT_STATE.ui }
      };
      
      verifyStreakValidity();
      applyTheme();
      applyLanguage();
      navigateTo('home');
      
      // Update profile views
      renderProfileView();
    })
    .catch(err => {
      console.error('Error fetching state:', err);
      showAuthScreen();
    });
  }

  function logout() {
    localStorage.removeItem('aurabible_token');
    localStorage.removeItem('aurabible_guest');
    devoAudioPlaying = false;
    clearInterval(devoAudioInterval);
    showAuthScreen();
  }

  // --- BIND AUTH FRONTEND CONTROLLERS ---

  const tabLogin = document.getElementById('auth-tab-login');
  const tabRegister = document.getElementById('auth-tab-register');
  const formLogin = document.getElementById('auth-login-form');
  const formRegister = document.getElementById('auth-register-form');
  const guestBtn = document.getElementById('auth-guest-btn');

  if (tabLogin && tabRegister && formLogin && formRegister) {
    tabLogin.addEventListener('click', () => {
      tabLogin.classList.add('active');
      tabLogin.style.color = 'var(--accent-color)';
      tabLogin.style.borderBottom = '2px solid var(--accent-color)';
      
      tabRegister.classList.remove('active');
      tabRegister.style.color = 'var(--text-secondary)';
      tabRegister.style.borderBottom = 'none';
      
      formLogin.style.display = 'flex';
      formRegister.style.display = 'none';
    });

    tabRegister.addEventListener('click', () => {
      tabRegister.classList.add('active');
      tabRegister.style.color = 'var(--accent-color)';
      tabRegister.style.borderBottom = '2px solid var(--accent-color)';
      
      tabLogin.classList.remove('active');
      tabLogin.style.color = 'var(--text-secondary)';
      tabLogin.style.borderBottom = 'none';
      
      formRegister.style.display = 'flex';
      formLogin.style.display = 'none';
    });
  }

  // Guest login button
  if (guestBtn) {
    guestBtn.addEventListener('click', () => {
      localStorage.setItem('aurabible_guest', 'true');
      initAuthState();
    });
  }

  // Handle Login form submit
  if (formLogin) {
    formLogin.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('login-username').value.trim();
      const password = document.getElementById('login-password').value;

      fetch(API_BASE + '/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showToast(data.error);
        } else {
          localStorage.setItem('aurabible_token', data.token);
          showToast(`Welcome back, ${data.user.name}!`);
          initAuthState();
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Server connection error.');
      });
    });
  }

  // Handle Register form submit
  if (formRegister) {
    formRegister.addEventListener('submit', (e) => {
      e.preventDefault();
      const username = document.getElementById('register-username').value.trim();
      const name = document.getElementById('register-name').value.trim();
      const email = document.getElementById('register-email').value.trim();
      const password = document.getElementById('register-password').value;

      fetch(API_BASE + '/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, name, email, password })
      })
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          showToast(data.error);
        } else {
          localStorage.setItem('aurabible_token', data.token);
          showToast(`Account created successfully! Welcome, ${data.user.name}.`);
          initAuthState();
        }
      })
      .catch(err => {
        console.error(err);
        showToast('Server connection error.');
      });
    });
  }

  // Handle Logout buttons click
  const logoutButtons = [
    document.getElementById('profile-logout-btn'),
    document.getElementById('sidebar-logout-btn')
  ];
  logoutButtons.forEach(btn => {
    if (btn) {
      btn.addEventListener('click', () => {
        logout();
        showToast('Logged out successfully.');
      });
    }
  });

  // Initial Load Trigger
  initAuthState();
});
