import React, {useMemo} from 'react';
import styles from './DependencyGraph.module.css';

const tones = {safe: '#47d99b', likelySafe: '#67c9ff', unknown: '#ffd06f', highRisk: '#ff9468', breaking: '#ff6e86'};

export default function DependencyGraph({snapshot, selectedId, onSelect}) {
  const model = useMemo(() => {
    const center = snapshot.profiles.find((profile) => profile.id === selectedId) || snapshot.profiles[0];
    if (!center) return {center: null, nodes: [], edges: []};
    const direct = snapshot.graph.edges.filter((edge) => edge.resolved && (edge.source === center.id || edge.target === center.id));
    const ids = [...new Set(direct.flatMap((edge) => [edge.source, edge.target]).filter(Boolean))].filter((id) => id !== center.id).slice(0, 18);
    const nodes = ids.map((id, index) => {
      const angle = (Math.PI * 2 * index) / Math.max(1, ids.length) - Math.PI / 2;
      return {profile: snapshot.profiles.find((profile) => profile.id === id), x: 350 + Math.cos(angle) * 250, y: 230 + Math.sin(angle) * 165};
    }).filter((item) => item.profile);
    return {center, nodes, edges: direct.filter((edge) => ids.includes(edge.source) || ids.includes(edge.target))};
  }, [snapshot, selectedId]);

  if (!model.center) return null;
  const positions = new Map([[model.center.id, {x: 350, y: 230}], ...model.nodes.map((node) => [node.profile.id, node])]);
  return <div className={styles.wrap}>
    <svg viewBox="0 0 700 460" role="img" aria-label={`Dependency relationships for ${model.center.name}`}>
      {model.edges.map((edge) => {const a = positions.get(edge.source); const b = positions.get(edge.target); return a && b ? <g key={edge.id}><line x1={a.x} y1={a.y} x2={b.x} y2={b.y}/><text x={(a.x+b.x)/2} y={(a.y+b.y)/2 - 5}>{edge.source === model.center.id ? 'depends on' : 'used by'}</text></g> : null;})}
      {model.nodes.map(({profile, x, y}) => <g key={profile.id} className={styles.node} onClick={() => onSelect(profile.id)} tabIndex="0" role="button"><circle cx={x} cy={y} r="28" fill={tones[profile.risk.key]}/><text x={x} y={y + 44}>{profile.name.length > 20 ? `${profile.name.slice(0, 18)}…` : profile.name}</text></g>)}
      <g className={styles.center}><circle cx="350" cy="230" r="45" fill={tones[model.center.risk.key]}/><text x="350" y="224">{model.center.name.length > 22 ? `${model.center.name.slice(0, 20)}…` : model.center.name}</text><text x="350" y="244">{model.center.risk.label} · {model.center.health.score}</text></g>
    </svg>
    <p>Showing {model.nodes.length} direct relationship{model.nodes.length === 1 ? '' : 's'}. Select a node to recenter the graph.</p>
  </div>;
}
