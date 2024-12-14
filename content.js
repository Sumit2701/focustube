let filterTopics = [];
let filterLanguage = "";

// Retrieve the user-defined topics and language from chrome.storage
chrome.storage.local.get(["filterTopics", "language"], (data) => {
  console.log("Stored topics and language retrieved from storage:", data);
  if (data.filterTopics && Array.isArray(data.filterTopics)) {
    filterTopics = data.filterTopics;
    filterLanguage = data.language || "";
    hideUnrelatedVideos();
    observeDynamicChanges(); // Start observing dynamic changes
  }
});

// Function to hide unrelated videos
function hideUnrelatedVideos() {
  const videoContainers = document.querySelectorAll(
    "ytd-rich-item-renderer, style-scope"
  );

  videoContainers.forEach((container) => {
    const titleElement = container.querySelector("#video-title");
    const channelElement = container.querySelector(
      "a.yt-simple-endpoint.style-scope.yt-formatted-string"
    );

    const titleText = titleElement?.textContent?.trim().toLowerCase() || "";
    const channelText = channelElement?.textContent?.trim().toLowerCase() || "";

    // Check if any topic matches the title or channel name
    const matchesTopic = filterTopics.some(
      (topic) => titleText.includes(topic) || channelText.includes(topic)
    );

    // Check if the language matches the title or channel name
    if (filterLanguage === "") {
      if (!matchesTopic) {
        container.style.display = "none";}
      } else {
        const detectedLanguage = detectLanguage(titleText + " " + channelText);
        const matchesLanguage =
           detectedLanguage === filterLanguage;
        if (!(matchesTopic || matchesLanguage)) {
          container.style.display = "none";
        }
    }
  });
}

// Function to observe dynamically loaded content
function observeDynamicChanges() {
  const observer = new MutationObserver(() => {
    hideUnrelatedVideos();
  });

  const targetNode =
    document.querySelector("ytd-rich-grid-renderer") || document.body;
  observer.observe(targetNode, { childList: true, subtree: true });
}
// Function to detect the language of the text
function detectLanguage(text) {
  if (isJapanese(text)) return "Japanese";
  if (isChinese(text)) return "Chinese";
  if (isKorean(text)) return "Korean";
  if (isHindi(text)) return "Hindi";
  if (isRussian(text)) return "Russian";
  if (isArabic(text)) return "Arabic";
  if (isGreek(text)) return "Greek";
  if (isTamil(text)) return "Tamil";
  if (isThai(text)) return "Thai";
  if (isGeorgian(text)) return "Georgian";
  return "English"; // Default to English if none match
}

// Language check functions using regex
function isJapanese(text) {
  const japaneseRegex = /[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FBF]/;
  return japaneseRegex.test(text);
}

function isChinese(text) {
  const chineseRegex = /[\u4E00-\u9FFF]/; // Matches Chinese characters
  return chineseRegex.test(text);
}

function isKorean(text) {
  const koreanRegex = /[\uAC00-\uD7AF]/; // Matches Hangul (Korean)
  return koreanRegex.test(text);
}

function isHindi(text) {
  const hindiRegex = /[\u0900-\u097F]/; // Matches Devanagari script
  return hindiRegex.test(text);
}

function isRussian(text) {
  const russianRegex = /[А-Яа-яЁё]/; // Matches Cyrillic characters (Russian)
  return russianRegex.test(text);
}

function isArabic(text) {
  const arabicRegex = /[\u0600-\u06FF]/; // Matches Arabic script
  return arabicRegex.test(text);
}

function isGreek(text) {
  const greekRegex = /[\u0370-\u03FF]/; // Matches Greek script
  return greekRegex.test(text);
}

function isTamil(text) {
  const tamilRegex = /[\u0B80-\u0BFF]/; // Matches Tamil script
  return tamilRegex.test(text);
}

function isThai(text) {
  const thaiRegex = /[\u0E00-\u0E7F]/; // Matches Thai script
  return thaiRegex.test(text);
}

function isGeorgian(text) {
  const georgianRegex = /[\u10A0-\u10FF]/; // Matches Georgian script
  return georgianRegex.test(text);
}
