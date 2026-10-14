
import { useRef, useState } from "react";
import "./App.css";

const initialFiles = [
  { id: 1, name: "Project-Report.pdf", size: "2.4 MB", type: "PDF", days: 2 },
  { id: 2, name: "Team-Photo.jpg", size: "1.8 MB", type: "Image", days: 1 },
  { id: 3, name: "Notes.txt", size: "12 KB", type: "Text", days: 7 },
  { id: 4, name: "Demo-Video.mp4", size: "15.6 MB", type: "Video", days: 3 },
];

const icons = {
  Home: "⌂",
  Upload: "⇧",
  "My Drops": "▤",
  "Shared With Me": "♧",
  Settings: "⚙",
};

function App() {
  const [activeTab, setActiveTab] = useState("Home");
  const [files, setFiles] = useState(initialFiles);
  const [search, setSearch] = useState("");
  const [notice, setNotice] = useState("");
  const [secretNote, setSecretNote] = useState("");
  const [noteOpen, setNoteOpen] = useState(false);
  const fileInput = useRef(null);

  function uploadFiles(fileList) {
    const selected = Array.from(fileList || []);

    if (!selected.length) return;

    const allowed = selected.filter((file) => {
      const extension = file.name.split(".").pop().toLowerCase();
      return ["pdf", "txt"].includes(extension);
    });

    if (!allowed.length) {
      setNotice("Only PDF and TXT files are supported right now.");
      return;
    }

    const newFiles = allowed.map((file, index) => ({
      id: Date.now() + index,
      name: file.name,
      size:
        file.size < 1024 * 1024
          ? `${Math.max(1, Math.round(file.size / 1024))} KB`
          : `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      type: file.name.toLowerCase().endsWith(".pdf") ? "PDF" : "Text",
      days: 7,
    }));

    setFiles((previous) => [...newFiles, ...previous]);
    setNotice(
      `${allowed.length} file(s) added to the demo dashboard. Backend upload is not connected yet.`
    );
    setActiveTab("My Drops");

    if (allowed.length !== selected.length) {
      setNotice(
        "Supported files were added. Other file types were skipped. Backend upload is not connected yet."
      );
    }
  }

  function copyDemoLink(file) {
    const demoLink = `${window.location.origin}/share/demo-${file.id}`;
    navigator.clipboard
      ?.writeText(demoLink)
      .then(() => setNotice("Demo link copied. It does not provide real file access yet."))
      .catch(() => setNotice(`Demo link: ${demoLink}`));
  }

  const visibleFiles = files.filter((file) =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">⬡</div>
          <span>Secret <b>Drop</b></span>
        </div>

        <nav className="navigation">
          {Object.entries(icons).map(([label, icon]) => (
            <button
              key={label}
              className={`nav-item ${activeTab === label ? "active" : ""}`}
              onClick={() => {
                setActiveTab(label);
                setNotice("");
              }}
            >
              <span className="nav-icon">{icon}</span>
              {label}
            </button>
          ))}
        </nav>

        <div className="sidebar-security">
          <span className="green-icon">⬡</span>
          <strong>Your privacy matters</strong>
          <p>Secure sharing starts with good security practices.</p>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search your files..."
              aria-label="Search files"
            />
          </div>
          <div className="profile">
            <div className="avatar">SD</div>
            <span>Secret User</span>
          </div>
        </header>

        <div className="content">
          {notice && (
            <div className="notice" role="status">
              {notice}
              <button onClick={() => setNotice("")}>×</button>
            </div>
          )}

          {activeTab === "Settings" ? (
            <section className="panel settings-panel">
              <span className="eyebrow">PREFERENCES</span>
              <h1>Settings</h1>
              <p className="muted">
                Account and sharing settings will be connected to the backend later.
              </p>
              <div className="file-row">
                <div>
                  <strong>Default link expiry</strong>
                  <p className="muted">Suggested expiry for new shares</p>
                </div>
                <span className="tag">7 days</span>
              </div>
              <div className="file-row">
                <div>
                  <strong>Allowed file types</strong>
                  <p className="muted">Currently enabled in this demo</p>
                </div>
                <span className="tag">PDF, TXT</span>
              </div>
            </section>
          ) : activeTab === "Shared With Me" ? (
            <section className="panel empty-state">
              <div className="empty-icon">♧</div>
              <h1>Shared with me</h1>
              <p className="muted">
                Shared documents will appear here when public-link access is connected.
              </p>
            </section>
          ) : (
            <>
              <section className="welcome">
                <div>
                  <span className="eyebrow">YOUR PRIVATE WORKSPACE</span>
                  <h1>
                    Welcome to <br />
                    <span>Secret Drop</span> <span className="shield">⬡</span>
                  </h1>
                  <p>
                    Share your documents securely.
                    <br />
                    Keep control of every link you create.
                  </p>
                </div>
                <div className="welcome-mark">⬡</div>
              </section>

              <section className="feature-grid">
                <Feature icon="♙" title="Secure" text="Designed for private sharing." />
                <Feature icon="ϟ" title="Simple" text="Quick and easy workflow." />
                <Feature icon="◉" title="Private" text="Keep control of your links." />
                <Feature icon="⬡" title="Control" text="Plan expiry and access rules." />
              </section>

              <section
                className="upload-zone"
                onDragOver={(event) => event.preventDefault()}
                onDrop={(event) => {
                  event.preventDefault();
                  uploadFiles(event.dataTransfer.files);
                }}
              >
                <input
                  ref={fileInput}
                  type="file"
                  accept=".pdf,.txt"
                  multiple
                  hidden
                  onChange={(event) => {
                    uploadFiles(event.target.files);
                    event.target.value = "";
                  }}
                />
                <div className="upload-symbol">⇧</div>
                <h3>Drop your files here</h3>
                <p>or click below to browse your computer</p>
                <button
                  className="primary-button browse-button"
                  onClick={() => fileInput.current?.click()}
                >
                  Choose files
                </button>
                <span className="upload-hint">PDF and TXT · Max 10 MB per file</span>
              </section>

              <section className="recent-section">
                <div className="section-heading">
                  <div>
                    <span className="eyebrow">YOUR DOCUMENTS</span>
                    <h2>
                      {activeTab === "My Drops"
                        ? "My Drops"
                        : activeTab === "Upload"
                          ? "Upload documents"
                          : "Recent Drops"}
                    </h2>
                  </div>
                  <span className="file-count">{visibleFiles.length} files</span>
                </div>

                {visibleFiles.length ? (
                  <div className="file-list">
                    {visibleFiles.map((file) => (
                      <div className="file-row" key={file.id}>
                        <div className={`file-icon ${file.type.toLowerCase()}`}>
                          {file.type === "PDF" ? "▤" : "▧"}
                        </div>
                        <div className="file-info">
                          <strong>{file.name}</strong>
                          <span>{file.size}</span>
                        </div>
                        <div className="expiry">
                          <span>◷</span> {file.days} days left
                        </div>
                        <button
                          className="icon-button"
                          title="Copy demo share link"
                          aria-label={`Copy demo link for ${file.name}`}
                          onClick={() => copyDemoLink(file)}
                        >
                          ↗
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="panel empty-state">
                    <h3>No matching files</h3>
                    <p className="muted">Try another search or choose a document.</p>
                  </div>
                )}
              </section>
            </>
          )}

          <footer>
            <span>⬡ SECRET DROP</span>
            <span>Private by design · Demo interface</span>
          </footer>
        </div>
      </main>

      {noteOpen && (
        <div className="modal-backdrop">
          <section className="modal panel">
            <button className="modal-close" onClick={() => setNoteOpen(false)}>
              ×
            </button>
            <span className="eyebrow">QUICK ACTION</span>
            <h2>Create a secret note</h2>
            <p className="muted">
              This note stays in the current page session only; it is not saved to a server.
            </p>
            <textarea
              value={secretNote}
              onChange={(event) => setSecretNote(event.target.value)}
              placeholder="Write your note..."
              rows={5}
            />
            <button
              className="primary-button"
              onClick={() => {
                setNotice(
                  secretNote.trim()
                    ? "Demo note created in the current interface. It has not been securely shared or saved."
                    : "Write something before creating your note."
                );
                setNoteOpen(false);
              }}
            >
              Create note
            </button>
          </section>
        </div>
      )}

      <div className="quick-actions">
        <button
          className="primary-button"
          onClick={() => fileInput.current?.click()}
        >
          + Upload file
        </button>
        <button
          className="secondary-button"
          onClick={() => setNoteOpen(true)}
        >
          ✎ Create secret note
        </button>
      </div>
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <article className="feature-card">
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{text}</p>
    </article>
  );
}

export default App;
