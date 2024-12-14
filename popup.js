document.getElementById("applyButton").addEventListener("click", () => {
    const topicsInput = document.getElementById("topicsInput").value;
    const selectedLanguage = document.getElementById("languageSelect").value;
  
   
  
    // Split the topics by commas and trim extra spaces
    const topicsArray = topicsInput
      .split(",")
      .map((topic) => topic.trim().toLowerCase())
      .filter((topic) => topic !== "");
  
  
    // Even if no topics are provided, if a language is selected, allow the filtering
    if (topicsArray.length > 0 || selectedLanguage) {
      // Save topics and selected language to chrome storage
      chrome.storage.local.set({ filterTopics: topicsArray, language: selectedLanguage }, () => {
        // Reload the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id);
          } 
        });
      });
    } 
  });
  