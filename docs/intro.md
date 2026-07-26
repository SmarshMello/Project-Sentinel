---
title: Start the Project Sentinel Guide
description: A beginner-first path for building a stable GTA V Legacy LSPDFR installation.
sidebar_position: 1
---

<span className="guide-kicker">BEGINNER-FIRST INSTALLATION SYSTEM</span>

# Build LSPDFR without guessing what comes next

<p className="guide-lead">Project Sentinel turns a complicated GTA V mod installation into a controlled sequence. You choose one architecture, install one layer, test it in game, and create a backup before continuing.</p>

:::danger Single-player only
Never enter GTA Online with a Project Sentinel installation. This guide is exclusively for GTA V Legacy Story Mode and LSPDFR.
:::

## Begin with the page that matches you

<div className="guide-grid">
  <a className="guide-card" href="./builds/choose-your-build">
    <span className="guide-card-badge">Recommended</span>
    <h3>I have not started yet</h3>
    <p>Compare the free build, paid realism build, and legacy alternative before downloading police plugins.</p>
    <span className="guide-card-action">Choose your build →</span>
  </a>
  <a className="guide-card" href="./getting-started/clean-install">
    <span className="guide-card-badge free">New installation</span>
    <h3>I need a clean GTA setup</h3>
    <p>Find the GTA root, confirm Legacy, disable BattlEye, create backups, and install the foundation safely.</p>
    <span className="guide-card-action">Prepare the game →</span>
  </a>
  <a className="guide-card" href="../compatibility">
    <span className="guide-card-badge">Existing build</span>
    <h3>I already have mods installed</h3>
    <p>Check your framework, versions, dependencies, and known conflicts before changing the installation.</p>
    <span className="guide-card-action">Check compatibility →</span>
  </a>
  <a className="guide-card" href="../doctor">
    <span className="guide-card-badge paid">Something is broken</span>
    <h3>My game or plugin is failing</h3>
    <p>Use the latest RagePluginHook.log and let Sentinel separate the root cause from downstream errors.</p>
    <span className="guide-card-action">Open Sentinel Doctor →</span>
  </a>
</div>

## The Sentinel method

<ol className="guide-steps">
  <li><strong>Prepare</strong><p>Confirm GTA V Legacy, locate the folder containing <code>GTA5.exe</code>, disable BattlEye for modded play, and make a clean backup.</p></li>
  <li><strong>Choose one architecture</strong><p>Use either the modern Policing Redefined path or the separate legacy Stop The Ped path. Never combine them casually.</p></li>
  <li><strong>Install one layer</strong><p>Add only the files for the current stage. Preserve the archive's folder structure and avoid overwriting newer shared dependencies.</p></li>
  <li><strong>Run a real test</strong><p>Launch the game, go on duty, and test the exact feature you just installed. Opening the game is not enough.</p></li>
  <li><strong>Back up the known-good state</strong><p>Create a clearly named checkpoint before installing the next subsystem.</p></li>
</ol>

## The complete installation sequence

<div className="guide-path">
  <span>Clean Legacy game</span><b>→</b><span>Core tools</span><b>→</b><span>LSPDFR</span><b>→</b><span>Police framework</span><b>→</b><span>MDT and dispatch</span><b>→</b><span>Voice systems</span><b>→</b><span>Uniforms and fleet</span><b>→</b><span>Graphics and audio</span>
</div>

:::info Why graphics and vehicles are last
Large vehicle packs, sirens, visual overhauls, and archive edits can cause loading failures that look unrelated to the police plugins. A working functional stack gives you a reliable comparison point.
:::

## What every beginner should record

<ul className="guide-checklist">
  <li>GTA V edition and exact game build</li>
  <li>LSPDFR and RAGE Plugin Hook versions</li>
  <li>Every mod name, version, download source, and installation date</li>
  <li>Every changed keybind</li>
  <li>Every shared DLL version</li>
  <li>The name of the last backup that passed testing</li>
</ul>

<div className="guide-next">
  <p><strong>Next:</strong> Compare the supported build paths before installing any police framework.</p>
  <a href="./builds/choose-your-build">Choose your build →</a>
</div>
