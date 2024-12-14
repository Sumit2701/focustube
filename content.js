let filterTopic = "";

// Retrieve the user-defined topic from chrome.storage
chrome.storage.local.get("filterTopic", (data) => {
  console.log("Stored topic retrieved from storage:", data); // Log the entire storage data
  if (data.filterTopic) {
    filterTopic = data.filterTopic.toLowerCase();
    console.log("Filter topic to hide unrelated videos:", filterTopic); // Confirm topic
    hideUnrelatedVideos();
    observeDynamicChanges(); // Start observing dynamic changes
  } else {
    console.log("No filter topic found in storage.");
  }
});

// Function to hide unrelated videos
function hideUnrelatedVideos() {
  console.log("Running hideUnrelatedVideos...");

  // Select all video titles
  const videoTitles = document.querySelectorAll("#video-title");
  console.log("Total video titles found:", videoTitles.length);

  videoTitles.forEach((titleElement) => {
    const titleText = titleElement.textContent || titleElement.innerText;

    // Ensure a valid video container exists
    const videoContainer = titleElement.closest("ytd-rich-item-renderer, style-scope");
    if (!videoContainer) {
      console.log("No video container found for title:", titleText);
      return;
    }

    // Check if the title matches the filter topic
    if (titleText && !titleText.toLowerCase().includes(filterTopic)) {
      console.log("Hiding video:", titleText);
      videoContainer.style.display = "none"; // Hide the video
    } else {
      console.log("Video matches filter topic:", titleText);
    }
  });
}

// Function to observe dynamically loaded content
function observeDynamicChanges() {
  const observer = new MutationObserver(() => {
    console.log("DOM changed - running hideUnrelatedVideos...");
    hideUnrelatedVideos();
  });

  // Observe changes to the #contents container where videos are loaded
  const targetNode = document.querySelector("ytd-rich-grid-renderer") || document.body;
  observer.observe(targetNode, { childList: true, subtree: true });

  console.log("Started observing DOM changes...");
}
