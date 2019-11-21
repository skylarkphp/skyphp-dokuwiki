define(function () {
    'use strict';
    function container() {
        return `
    <ul class="coder-nav">
      <li class="coder-nav-item coder-nav-item-result">
        <a href="#" data-coder-type="result">
          Result
        </a>
      </li>
      <li class="coder-nav-item coder-nav-item-html">
        <a href="#" data-coder-type="html">
          HTML
        </a>
      </li>
      <li class="coder-nav-item coder-nav-item-css">
        <a href="#" data-coder-type="css">
          CSS
        </a>
      </li>
      <li class="coder-nav-item coder-nav-item-js">
        <a href="#" data-coder-type="js">
          JavaScript
        </a>
      </li>
    </ul>
    <div class="coder-pane coder-pane-result"><iframe></iframe></div>
    <div class="coder-pane coder-pane-html"></div>
    <div class="coder-pane coder-pane-css"></div>
    <div class="coder-pane coder-pane-js"></div>
  `;
    }
    function paneActiveClass(type) {
        return `coder-pane-active-${ type }`;
    }
    function containerClass() {
        return 'coder';
    }
    function hasFileClass(type) {
        return `coder-has-${ type }`;
    }
    function editorClass(type) {
        return `coder-editor coder-editor-${ type }`;
    }
    function editorContent(type, fileUrl = '') {
        return `
    <textarea data-coder-type="${ type }" data-coder-file="${ fileUrl }"></textarea>
    <div class="coder-status"></div>
  `;
    }
    function statusMessage(err) {
        return `
    <p>${ err }</p>
  `;
    }
    function statusClass(type) {
        return `coder-status-${ type }`;
    }
    function statusActiveClass(type) {
        return `coder-status-active-${ type }`;
    }
    function pluginClass(name) {
        return `coder-plugin-${ name }`;
    }
    function statusLoading(url) {
        return `Loading <strong>${ url }</strong>..`;
    }
    function statusFetchError(url) {
        return `There was an error loading <strong>${ url }</strong>.`;
    }
    return {
        container: container,
        paneActiveClass: paneActiveClass,
        containerClass: containerClass,
        hasFileClass: hasFileClass,
        editorClass: editorClass,
        editorContent: editorContent,
        statusMessage: statusMessage,
        statusClass: statusClass,
        statusActiveClass: statusActiveClass,
        pluginClass: pluginClass,
        statusLoading: statusLoading,
        statusFetchError: statusFetchError
    };
});