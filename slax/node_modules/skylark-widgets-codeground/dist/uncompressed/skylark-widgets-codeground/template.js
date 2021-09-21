define(function () {
    'use strict';
    function container() {
        return `
    <ul class="codeg-nav">
      <li class="codeg-nav-item codeg-nav-item-result">
        <a href="#" data-codeg-type="result">
          Result
        </a>
      </li>
      <li class="codeg-nav-item codeg-nav-item-html">
        <a href="#" data-codeg-type="html">
          HTML
        </a>
      </li>
      <li class="codeg-nav-item codeg-nav-item-css">
        <a href="#" data-codeg-type="css">
          CSS
        </a>
      </li>
      <li class="codeg-nav-item codeg-nav-item-js">
        <a href="#" data-codeg-type="js">
          JavaScript
        </a>
      </li>
    </ul>
    <div class="codeg-pane codeg-pane-result"><iframe></iframe></div>
    <div class="codeg-pane codeg-pane-html"></div>
    <div class="codeg-pane codeg-pane-css"></div>
    <div class="codeg-pane codeg-pane-js"></div>
  `;
    }
    function paneActiveClass(type) {
        return `codeg-pane-active-${ type }`;
    }
    function containerClass() {
        return 'codeg';
    }
    function hasFileClass(type) {
        return `codeg-has-${ type }`;
    }
    function editorClass(type) {
        return `codeg-editor codeg-editor-${ type }`;
    }
    function editorContent(type) {
        return `
    <textarea data-codeg-type="${ type }" ></textarea>
    <div class="codeg-status"></div>
  `;
    }
    function statusMessage(err) {
        return `
    <p>${ err }</p>
  `;
    }
    function statusClass(type) {
        return `codeg-status-${ type }`;
    }
    function statusActiveClass(type) {
        return `codeg-status-active-${ type }`;
    }
    function pluginClass(name) {
        return `codeg-plugin-${ name }`;
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