// Copyright (c) Jupyter Development Team.
// Distributed under the terms of the Modified BSD License.
'use strict';

import {
  initializeDiff
} from './app/diff';

import {
  initializeMerge, closeMerge, forceCloseMerge
} from './app/merge';

import {
  initializeCompare, closeCompare
} from './app/compare';

import {
  closeTool, getConfigOption, handleError, toolClosed
} from './app/common';


import 'codemirror/lib/codemirror.css';
import '@jupyterlab/codemirror/style/index.css';

import '@jupyterlab/theme-light-extension/style/index.css';
import '@jupyterlab/notebook/style/index.css';



/** */
function initialize() {
  let closable = getConfigOption('closable');
  let type: 'diff' | 'merge' | 'compare';
  if (document.getElementById('compare-local')) {
    initializeCompare();
    type = 'compare';
  } else if (getConfigOption('local') || document.getElementById('merge-local')) {
    initializeMerge();
    type = 'merge';
  } else {
    initializeDiff();
    type = 'diff';
  }

  let closeBtn = document.getElementById('nbdime-close') as HTMLButtonElement;
  if (closable) {
    let close = (ev: Event, unloading=false) => {
      if (type === 'merge') {
        return closeMerge(ev, unloading);
      } else if (type === 'compare') {
        return closeCompare(ev, unloading);
      } else if (!unloading) {
        return closeTool();
      }
      return null;
    };
    closeBtn.onclick = close;

    window.onbeforeunload = (ev: Event) => {
      if (!toolClosed) {
        return close(ev, true);
      }
    };

    window.onunload = (ev: Event) => {
      if (!toolClosed) {
        if (type === 'merge') {
          forceCloseMerge();
        } else {
          closeTool();
        }
      }
    };

    closeBtn.style.display = 'initial';
  }
}

window.onload = initialize;
window.onerror = handleError;
