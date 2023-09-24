class BBModal extends Base {
  RESPONDABLE_MODALS = new Set([
    'alert',
    'confirm',
    'prompt',
    'paste',
    'beforeunload',
    'filechooser',
    'infobox',
    'auth',
    'intentPrompt',
    'settings'
  ]);

  constructor() {
    super();

    this.unloadHandler = this.requestModalBeClosedFirst.bind(this);
    this.prepareState();
  }

  prepareState(currentModal = {}) {
    const state = this.state;
    //super.prepareState();
    // these are default values when there is no current Modal
    let msg = '';
    let type = '';
    let title = '';
    let currentModalEl = false;
    let highlight = undefined;
    let csrfToken = '';
    let requestId = '';
    let sessionId = '';
    let mode = '';
    let accept = '';
    let multiple = false;
    let submitText = '';
    let cancelText = '';
    let otherButton = null;
    let link = null;
    let working = false;
    let url = '';

    if ( currentModal ) {
      // the defaults here are defaults when there *is* a current modal
      ({
        msg:msg = 'Empty',
        type,
        highlight: highlight = false,
        csrfToken:csrfToken = '',
        url:url = '',
        title:title = 'Untitled',
        el:currentModalEl,
        requestId:requestId = '',
        mode:mode = '',
        sessionId:sessionId = '',
        accept: accept = '',
        submitText:submitText = 'Submit',
        cancelText:cancelText = 'Cancel',
        otherButton:otherButton = null,
        link:link = null,
        working:working = false,
      } = currentModal);
      window.addEventListener('beforeunload', this.unloadHandler);
    } else {
      window.removeEventListener('beforeunload', this.unloadHandler);
    }

    if ( type == 'intentPrompt' ) {
      if ( ! url ) {
        throw new TypeError(`IntentPrompt modal requires a url`);
      } else {
        const Url = new URL(url);
        if ( Url.protocol == 'intent:' ) {
          if ( ( Url + '').includes('google.com/maps') ) {
            Url.protocol = 'https:';
          }
          url = Url;
        }
      }
    }

    if ( type == 'auth' && ! requestId ) {
      throw new TypeError(`Auth modal requires a requestId to send the response to`);
    }

    if ( type == 'filechooser' && !(mode && sessionId && csrfToken) ) {
      DEBUG.debugModal && console.log(currentModal);
      throw new TypeError(`File chooser modal requires all of: sessionId, mode and csrfToken`);
    }

    // we are getting this now via async fetch inside the HTML template ahahah
    /*
    if ( type == 'settings' && !csrfToken ) {
      DEBUG.debugModal && console.log(currentModal);
      throw new TypeError(`Settings modal requires a csrfToken`);
    }
    */

    if ( mode == 'selectMultiple' ) {
      multiple = true;
    }

    currentModal = {
      type, csrfToken, mode, requestId, msg,
      highlight,
      el: state.viewState.ModalRef[type], 
      sessionId, otherButton, title, url, multiple, accept,
      link,
      working, submitText, cancelText,
    };

    DEBUG.debugModal && console.log('after prepare state', {currentModal}, '(also "others" state mixin)');

    this.others = currentModal;
  }

  async openModal({modal} = {}) {
    if ( this.opening ) return;
    this.opening = true;
    const state = this.state;
    const {ModalRef} = state.viewState;
    const {
      sessionId, mode, requestId, title, type, message:msg, defaultPrompt, url, otherButton,
      link,
      highlight,
      csrfToken,
    } = modal;
    if ( !ModalRef[type] ) { 
      DEBUG.debugModal && console.warn(`Waiting until modal type ${type} has its element loaded...`);
    }
    await state._top.untilTrue(() => !!ModalRef[type], 100, 1000);
    const currentModal = {
      type, csrfToken, mode, 
      highlight, 
      requestId, 
      msg,
      el:ModalRef[type], 
      sessionId, 
      otherButton, 
      link,
      title, url
    };
    state.viewState.currentModal = currentModal;
    this.prepareState(currentModal);
    localStorage.setItem('lastModal', JSON.stringify(modal));

    DEBUG.debugModal && console.log(state.viewState.currentModal);

    const modalDebug = {
      defaultPrompt, url, highlight, currentModal, ModalRef, state, title, type, otherButton, csrfToken,
      link,
    };

    (DEBUG.debugModal || (DEBUG.val >= DEBUG.med)) && Object.assign(self, {modalDebug});

    (DEBUG.debugModal || (DEBUG.val >= DEBUG.med)) && console.log(`Will display modal ${type} with ${msg} on el:`, state.viewState.currentModal.el);

    this.state = state;
    setTimeout(async () => {
      if ( type == 'copy' ) {
        await state._top.untilTrue(() => this.copyBoxTextarea.value == msg, 300, 20);
        this.copyBoxTextarea.select();
        navigator.clipboard.writeText(this.copyBoxTextarea.value);
        const currentModal = {
          type, csrfToken, mode, 
          highlight, 
          requestId, 
          msg,
          el:ModalRef[type], 
          sessionId, 
          otherButton, 
          link,
          title: title + ' - Copied to Clipboard!', 
          url
        };
        state.viewState.currentModal = currentModal;
        this.prepareState(currentModal);
        this.state = state;
      }
    }, 0);
  }

  closeModal(click) {
    const state = this.state;
    if ( ! click.target.matches('button') || ! state.viewState.currentModal ) return;

    const response = click.target.value || 'close';
    const data = click.target.closest('form')?.response?.value || '';

    const {sessionId, type} = state.viewState.currentModal;

    state.viewState.lastModal = state.viewState.currentModal;
    state.viewState.lastModal.modalResponse = response;

    const {type:modalType} = state.viewState.lastModal;

    if ( this.RESPONDABLE_MODALS.has(modalType) ) {
      const modalResponse = {
        synthetic: true,
        modalType,
        type: "respond-to-modal",
        response,
        sessionId,
        [modalType === 'prompt' ? 'promptText': 'data']: data
      };
      DEBUG.debugModal && console.log({modalResponse});
      state.H(modalResponse);
    }
    
    this.onlyCloseModal();
  }

  onlyCloseModal() {
    const {state} = this;

    state.viewState.currentModal = null;

    this.opening = false;

    setTimeout(() => this.state = state, 50);
  }

  respondWithAuth(click) {
    const {state} = this;
    click.preventDefault();
    click.stopPropagation();
    const form = click.target.closest('form'); 
    const data = new FormData(form);
    const requestId = data.get('requestid').slice(0,140);
    const username = data.get('username').slice(0,140);
    const password = data.get('password').slice(0,140);
    const authResponse = {
      username, 
      password,
      response: "ProvideCredentials"
    };
    state.H({
      synthetic: true,
      type: 'auth-response',
      requestId,
      authResponse
    });
    DEBUG.debugAuth && console.log({authResponse});
    this.closeModal(click);
  }

  sendPaste(click) {
    const {state} = this;
    click.preventDefault();
    click.stopPropagation();
    const modals = this;
    const form = click.target.closest('form'); 
    const data = new FormData(form);
    const pasteText = data.get('response').slice(0,32000);
    sendPasteData(pasteText);

    function sendPasteData(pasteData) {
      const input = state.viewState.shouldHaveFocus;
      if ( ! input ) return;
      const value = input.value;
      const newValue = value.slice(0, input.selectionStart) + pasteData + value.slice(input.selectionEnd);
      input.value = newValue;
      input.selectionStart = input.selectionEnd;
      if ( document.deepActiveElement !== input ) {
        input.focus();
      }
      state.H({
        type: 'typing',
        data: pasteData,
        synthetic: true,
        event: {paste: true, simulated: true}
      });
      setTimeout(() => {
        state.checkResults();
      }, 300);
      modals.closeModal(click);
    }
  }

  respondWithCancel(click) {
    const {state} = this;
    click.preventDefault();
    click.stopPropagation();
    const form = click.target.closest('form'); 
    const data = new FormData(form);
    const requestId = data.get('requestid').slice(0,140);
    const authResponse = {
      response: "CancelAuth"
    };
    state.H({
      synthetic: true,
      type: 'auth-response',
      modalType: 'auth',
      requestId,
      authResponse
    });
    this.closeModal(click);
  }
  
  async chooseFile(click) {
    const {state} = this;
    click.preventDefault();
    click.stopPropagation();
    const form = click.target.closest('form');
    const body = new FormData(form);
    const request = { 
      method: form.method,
      body
    };
    Object.assign(state.viewState.currentModal, {
      submitText: 'Uploading...',
      working: true
    });
    this.prepareState(state.viewState.currentModal);
    this.state = state;
    const resp = await fetch(form.action, request).then(r => r.json());
    if ( resp.error ) {
      alert(resp.error);
    } else {
      DEBUG.val && console.log(`Success attached files`, resp); 
      console.log({resp});
    }
    this.onlyCloseModal(click);
  }

  async cancelFileChooser(click) {
    const {state} = this;
    click.preventDefault();
    click.stopPropagation();
    const form = click.target.closest('form');
    form.reset();
    const body = new FormData(form);
    body.delete('files');
    const request = { 
      method: form.method,
      body
    };
    Object.assign(state.viewState.currentModal, {
      cancelText: 'Canceling...',
      working: true
    });
    this.prepareState(state.viewState.currentModal);
    this.state = state;
    const resp = await fetch(form.action, request).then(r => r.json());
    if ( resp.error ) {
      alert(`An error occurred`);
      console.log({resp});
    } else {
      DEBUG.val && console.log(`Success cancelling file attachment`, resp); 
      console.log({resp});
    }
    this.onlyCloseModal(click);
  }

  requestModalBeClosedFirst(unload) {
    const {state} = this;
    if ( state.viewState.currentModal ) {
      const message = "Please close the modal first";
      const obj = (unload || window.event);
      obj?.preventDefault?.();
      if ( obj ) obj.returnValue = message;
      return message;
    }
  }

  oldsetup() {
    // Auxilliary view functions 
      const ModalRef = {
        alert: null, confirm: null, prompt: null, beforeunload: null,
        infobox: null, notice: null, auth: null, filechooser: null,
        paste: null,
        intentPrompt: null,
        settings: null,
      };

    // Permission request
      function PermissionRequest({
        permission, request, page
      }) {
        return R`
          <article class="permission-request hidden">
            <h1>${permission}</h1>
            <p class=request>${page} is requesting ${permission} permission. The details are: ${request}</p>
            <button class=grant>Grant</button>
            <button class=deny>Deny</button>
          </article>
        `;
      }
  }
}
