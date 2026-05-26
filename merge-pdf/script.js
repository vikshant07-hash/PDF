const dropZone = document.getElementById('drop-zone');
const fileInput = document.getElementById('file-input');
const fileListContainer = document.getElementById('file-list-container');
const fileList = document.getElementById('file-list');
const fileCount = document.getElementById('file-count');
const clearAllBtn = document.getElementById('clear-all');
const mergeBtn = document.getElementById('merge-btn');
const downloadBtn = document.getElementById('download-btn');
const outputName = document.getElementById('output-name');
const loader = document.getElementById('loading-overlay');

let files = [];
let blobURL = null;

/* OPEN FILE */
dropZone.addEventListener('click', () => fileInput.click());

fileInput.addEventListener('change', (e) => {
    handleFiles(e.target.files);
});

/* DRAG DROP */
['dragover', 'dragenter'].forEach(evt => {
    dropZone.addEventListener(evt, e => e.preventDefault());
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
});

/* HANDLE FILES */
function handleFiles(fileListInput) {

    const allFiles = Array.from(fileListInput);
    const pdfs = allFiles.filter(f => f.type === "application/pdf");

    pdfs.forEach(file => {
        files.push({
            id: Date.now() + Math.random(),
            file,
            preview: URL.createObjectURL(file)
        });
    });

    renderFiles();
}

/* RENDER FILES */
function renderFiles() {

    fileList.innerHTML = "";

    if (files.length === 0) {
        fileListContainer.classList.add("hidden");
        return;
    }

    fileListContainer.classList.remove("hidden");
    fileCount.innerText = files.length;

    files.forEach(f => {

        const li = document.createElement("li");

        li.innerHTML = `
            <iframe src="${f.preview}#toolbar=0" width="50" height="60"></iframe>
            <span>${f.file.name}</span>
            <button class="remove">X</button>
        `;

        li.querySelector(".remove").onclick = () => {
            files = files.filter(x => x.id !== f.id);
            renderFiles();
        };

        fileList.appendChild(li);
    });
}

/* CLEAR */
clearAllBtn.addEventListener("click", () => {
    files = [];
    renderFiles();
});

/* MERGE */
mergeBtn.addEventListener("click", async () => {

    if (files.length < 2) {
        alert("Add at least 2 PDFs");
        return;
    }
         loader.classList.add("active");


    try {

   

        const merged = await PDFLib.PDFDocument.create();

        for (let f of files) {
            const bytes = await f.file.arrayBuffer();
            const pdf = await PDFLib.PDFDocument.load(bytes);

            const pages = await merged.copyPages(pdf, pdf.getPageIndices());
            pages.forEach(p => merged.addPage(p));
        }

        const mergedBytes = await merged.save();
        const blob = new Blob([mergedBytes], { type: "application/pdf" });

        if (blobURL) URL.revokeObjectURL(blobURL);
        blobURL = URL.createObjectURL(blob);

        loader.classList.remove("active"); // HIDE LOADER

        downloadBtn.classList.remove("hidden");

    } catch (err) {
        loader.classList.remove("active");
        alert("Error merging PDFs");
    }
});

/* DOWNLOAD */
downloadBtn.addEventListener("click", () => {

    let name = outputName.value.trim() || "merged_document";
    if (!name.endsWith(".pdf")) name += ".pdf";

    const a = document.createElement("a");
    a.href = blobURL;
    a.download = name;
    a.click();
});

/* MOBILE MENU */
const mobileMenu = document.querySelector(".mobile-menu");
const navLinks = document.querySelector(".nav-links");

mobileMenu.addEventListener("click", () => {
    navLinks.classList.toggle("active");
});