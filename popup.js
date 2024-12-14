document.getElementById("applyButton").addEventListener("click", () => {
    const topic = document.getElementById("topicInput").value;
  
    // Debugging logs
    console.log("Button clicked!");
    console.log("Entered topic:", topic);
  
    if (topic.trim() !== "") {
      chrome.storage.local.set({ filterTopic: topic }, () => {
        console.log(`Filter topic saved: "${topic}"`);
        // Reload the active tab
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
          if (tabs.length > 0) {
            chrome.tabs.reload(tabs[0].id);
          } else {
            console.error("No active tab found.");
          }
        });
      });
    } else {
      alert("Please enter a valid topic.");
    }
  });
  