let files = [];

// File input change handler
document
  .getElementById("fileInput")
  .addEventListener("change", handleFileSelect);

// Drag and drop handlers
const uploadArea = document.getElementById("uploadArea");
uploadArea.addEventListener("dragover", handleDragOver);
uploadArea.addEventListener("dragleave", handleDragLeave);
uploadArea.addEventListener("drop", handleDrop);
uploadArea.addEventListener("click", () =>
  document.getElementById("fileInput").click()
);

function handleFileSelect(event) {
  const selectedFiles = Array.from(event.target.files);
  addFiles(selectedFiles);
}

function handleDragOver(event) {
  event.preventDefault();
  uploadArea.classList.add("dragover");
}

function handleDragLeave(event) {
  event.preventDefault();
  uploadArea.classList.remove("dragover");
}

function handleDrop(event) {
  event.preventDefault();
  uploadArea.classList.remove("dragover");
  const droppedFiles = Array.from(event.dataTransfer.files);
  addFiles(droppedFiles);
}

function addFiles(newFiles) {
  newFiles.forEach((file) => {
    const fileObj = {
      id: Date.now() + Math.random(),
      name: file.name,
      size: formatFileSize(file.size),
      type: getFileType(file.name),
      uploadDate: new Date().toLocaleDateString(),
      file: file,
    };
    files.push(fileObj);
  });
  renderFiles();
}

function getFileType(filename) {
  const ext = filename.split(".").pop().toLowerCase();
  if (["pdf"].includes(ext)) return "pdf";
  if (["doc", "docx"].includes(ext)) return "doc";
  if (["jpg", "jpeg", "png", "gif"].includes(ext)) return "img";
  return "other";
}

function getFileIcon(type) {
  const icons = {
    pdf: "PDF",
    doc: "DOC",
    img: "IMG",
    other: "FILE",
  };
  return icons[type] || "FILE";
}

function formatFileSize(bytes) {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

function renderFiles() {
  const filesList = document.getElementById("filesList");

  if (files.length === 0) {
    filesList.innerHTML = `
                    <div class="empty-state">
                        <h3>No files yet</h3>
                        <p>Upload your first file to get started</p>
                    </div>
                `;
    return;
  }

  filesList.innerHTML = files
    .map(
      (file) => `
                <div class="file-item">
                    <div class="file-icon ${file.type}">${getFileIcon(
        file.type
      )}</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-details">Modified ${
                          file.uploadDate
                        } • ${file.size}</div>
                    </div>
                    <div class="file-actions">
                        <button class="action-btn" onclick="previewFile('${
                          file.id
                        }')">Preview</button>
                        <button class="action-btn" onclick="downloadFile('${
                          file.id
                        }')">Download</button>
                        <button class="action-btn" onclick="deleteFile('${
                          file.id
                        }')">Delete</button>
                    </div>
                </div>
            `
    )
    .join("");
}

function previewFile(fileId) {
  const file = files.find((f) => f.id == fileId);
  if (!file) return;

  const modal = document.getElementById("previewModal");
  const modalTitle = document.getElementById("modalTitle");
  const modalBody = document.getElementById("modalBody");

  modalTitle.textContent = file.name;

  if (file.type === "img") {
    const reader = new FileReader();
    reader.onload = function (e) {
      modalBody.innerHTML = `<img src="${e.target.result}" style="max-width: 100%; height: auto;">`;
    };
    reader.readAsDataURL(file.file);
  } else {
    modalBody.innerHTML = `
                    <div style="text-align: center; padding: 40px;">
                        <div class="file-icon ${
                          file.type
                        }" style="width: 64px; height: 64px; font-size: 24px; margin: 0 auto 16px;">
                            ${getFileIcon(file.type)}
                        </div>
                        <h4>${file.name}</h4>
                        <p>Size: ${file.size}</p>
                        <p>Type: ${file.type.toUpperCase()}</p>
                        <p style="margin-top: 16px; color: #5f6368;">
                            Preview not available for this file type
                        </p>
                    </div>
                `;
  }

  modal.style.display = "block";
}

function downloadFile(fileId) {
  const file = files.find((f) => f.id == fileId);
  if (!file) return;

  const url = URL.createObjectURL(file.file);
  const a = document.createElement("a");
  a.href = url;
  a.download = file.name;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function deleteFile(fileId) {
  if (confirm("Are you sure you want to delete this file?")) {
    files = files.filter((f) => f.id != fileId);
    renderFiles();
  }
}

function closeModal() {
  document.getElementById("previewModal").style.display = "none";
}

// Close modal when clicking outside
window.addEventListener("click", function (event) {
  const modal = document.getElementById("previewModal");
  if (event.target === modal) {
    closeModal();
  }
});

// Search functionality
document.querySelector(".search-input").addEventListener("input", function (e) {
  const searchTerm = e.target.value.toLowerCase();
  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm)
  );

  // Store original files and render filtered ones
  if (searchTerm) {
    renderFilteredFiles(filteredFiles);
  } else {
    renderFiles();
  }
});

function renderFilteredFiles(filteredFiles) {
  const filesList = document.getElementById("filesList");

  if (filteredFiles.length === 0) {
    filesList.innerHTML = `
                    <div class="empty-state">
                        <h3>No files found</h3>
                        <p>Try a different search term</p>
                    </div>
                `;
    return;
  }

  filesList.innerHTML = filteredFiles
    .map(
      (file) => `
                <div class="file-item">
                    <div class="file-icon ${file.type}">${getFileIcon(
        file.type
      )}</div>
                    <div class="file-info">
                        <div class="file-name">${file.name}</div>
                        <div class="file-details">Modified ${
                          file.uploadDate
                        } • ${file.size}</div>
                    </div>
                    <div class="file-actions">
                        <button class="action-btn" onclick="previewFile('${
                          file.id
                        }')">Preview</button>
                        <button class="action-btn" onclick="downloadFile('${
                          file.id
                        }')">Download</button>
                        <button class="action-btn" onclick="deleteFile('${
                          file.id
                        }')">Delete</button>
                    </div>
                </div>
            `
    )
    .join("");
}

// Initialize
renderFiles();
