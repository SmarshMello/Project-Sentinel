import React, {useRef, useState} from 'react';
import styles from './styles.module.css';

export default function FileDropZone({accept, multiple=false, onFiles, label='Drop files here', hint='or click to browse', compact=false}) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const open = () => inputRef.current?.click();
  const consume = (files) => {
    const list = Array.from(files || []);
    if (list.length) onFiles?.(multiple ? list : list.slice(0, 1));
  };
  return <div
    className={`${styles.zone} ${dragging ? styles.dragging : ''} ${compact ? styles.compact : ''}`}
    role="button"
    tabIndex={0}
    onClick={open}
    onKeyDown={(event) => {if (event.key === 'Enter' || event.key === ' ') {event.preventDefault(); open();}}}
    onDragEnter={(event) => {event.preventDefault(); setDragging(true);}}
    onDragOver={(event) => {event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; setDragging(true);}}
    onDragLeave={(event) => {event.preventDefault(); if (!event.currentTarget.contains(event.relatedTarget)) setDragging(false);}}
    onDrop={(event) => {event.preventDefault(); setDragging(false); consume(event.dataTransfer.files);}}
  >
    <input ref={inputRef} hidden type="file" accept={accept} multiple={multiple} onChange={(event) => {consume(event.target.files); event.target.value='';}}/>
    <div className={styles.icon}>⇩</div>
    <div><strong>{label}</strong><span>{hint}</span></div>
  </div>;
}
