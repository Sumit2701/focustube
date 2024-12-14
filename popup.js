document.getElementById("applyButton").addEventListener("click", () => {
    const input = document.getElementById("topicsInput").value;
  
    // Debugging logs
    console.log("Button clicked!");
    console.log("Entered topics:", input);
  
    if (input.trim() !== "") {
      // Split the topics by commas and trim extra spaces
      const topicsArray = input
        .split(",")
        .map((topic) => topic.trim().toLowerCase())
        .filter((topic) => topic !== "");
  
      console.log("Topics array:", topicsArray);
  
      if (topicsArray.length > 0) {
        chrome.storage.local.set({ filterTopics: topicsArray }, () => {
          console.log(`Filter topics saved: ${topicsArray}`);
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
        alert("Please enter valid topics.");
      }
    } else {
      alert("Please enter at least one topic.");
    }
  });
  