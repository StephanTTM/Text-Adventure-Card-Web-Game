import React, { useState, useEffect, useRef } from 'react';

/**
 * Component for exporting/importing mission JSON.
 * @param {Object} props
 * @param {Object} props.mission Mission object
 * @param {Function} props.onImport Called with parsed mission on import
 */
export default function ExportImport({ mission, onImport }) {
  const [jsonText, setJsonText] = useState('');
  const fileDownloadRef = useRef(null);

  // Keep text in sync with mission
  useEffect(() => {
    setJsonText(JSON.stringify(mission, null, 2));
  }, [mission]);

  // Handle import button
  const handleImport = () => {
    try {
      const parsed = JSON.parse(jsonText);
      onImport(parsed);
    } catch (err) {
      alert('Invalid JSON: ' + err.message);
    }
  };

  // Download JSON file
  const handleDownload = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = fileDownloadRef.current;
    a.href = url;
    a.download = `${mission.id || 'mission'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Copy JSON to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(jsonText);
      alert('JSON copied to clipboard');
    } catch {
      alert('Failed to copy to clipboard');
    }
  };

  return (
    <div className="export-import">
      <h2>Import/Export</h2>
      <textarea
        value={jsonText}
        onChange={(e) => setJsonText(e.target.value)}
        rows={10}
        placeholder="Mission JSON"
      />
      <div>
        <button onClick={handleImport}>Import JSON</button>
        <button onClick={handleDownload}>Download JSON</button>
        <button onClick={handleCopy}>Copy JSON</button>
        <a ref={fileDownloadRef} style={{ display: 'none' }}>
          download
        </a>
      </div>
    </div>
  );
}