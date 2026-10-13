(function () {
  'use strict';

  var form = document.getElementById('signup');
  var done = document.getElementById('done');
  var rules = document.querySelectorAll('#rules li');
  var password = document.getElementById('password');
  var confirmField = document.getElementById('confirm');

  /* one function per field: returns an error message, or '' when the value is fine */
  var checks = {
    name: function (f) {
      var v = f.value.trim();
      if (!v) return 'Enter your full name.';
      if (v.length < 2) return 'The name needs at least 2 characters.';
      return '';
    },
    email: function (f) {
      var v = f.value.trim();
      if (!v) return 'Enter your email.';
      if (f.validity.typeMismatch) return 'This does not look like an email. Example: name@example.com';
      return '';
    },
    group: function (f) {
      var v = f.value.trim();
      if (!v) return 'Enter your group.';
      if (!/^[0-9]{4}[A-Za-z]$/.test(v)) return 'Use four digits and one letter, like 4230Z.';
      return '';
    },
    password: function (f) {
      var v = f.value;
      if (!v) return 'Create a password.';
      if (v.length < 8) return 'Use at least 8 characters. You have ' + v.length + '.';
      if (!/[A-Za-z]/.test(v) || !/[0-9]/.test(v)) return 'Add at least one letter and one number.';
      return '';
    },
    confirm: function (f) {
      if (!f.value) return 'Repeat the password.';
      if (f.value !== password.value) return 'The passwords do not match.';
      return '';
    },
    terms: function (f) {
      return f.checked ? '' : 'Tick the box to continue.';
    }
  };

  function show(field, message) {
    var out = document.getElementById(field.id + '-error');
    out.textContent = message;
    if (field.type === 'checkbox') return;
    if (message) { field.setAttribute('aria-invalid', 'true'); field.classList.remove('valid'); }
    else { field.removeAttribute('aria-invalid'); field.classList.toggle('valid', field.value !== ''); }
  }

  function validate(field) {
    var message = checks[field.name](field);
    show(field, message);
    return message === '';
  }

  /* live checklist next to the form */
  function updateRules() {
    var v = password.value;
    var state = {
      length: v.length >= 8,
      mix: /[A-Za-z]/.test(v) && /[0-9]/.test(v),
      match: v !== '' && v === confirmField.value
    };
    rules.forEach(function (li) { li.classList.toggle('met', state[li.getAttribute('data-rule')]); });
  }

  var touched = {};
  Array.prototype.forEach.call(form.elements, function (field) {
    if (!checks[field.name]) return;
    field.addEventListener('blur', function () { touched[field.name] = true; validate(field); });
    field.addEventListener('input', function () {
      if (touched[field.name] || field.getAttribute('aria-invalid')) validate(field);
      if (field === password || field === confirmField) {
        updateRules();
        if (touched.confirm && confirmField.value) validate(confirmField);
      }
    });
    field.addEventListener('change', function () { if (field.type === 'checkbox') { touched[field.name] = true; validate(field); } });
  });

  /* show / hide password */
  var toggle = document.querySelector('.pw__toggle');
  toggle.addEventListener('click', function () {
    var hidden = password.type === 'password';
    password.type = hidden ? 'text' : 'password';
    toggle.textContent = hidden ? 'Hide' : 'Show';
    toggle.setAttribute('aria-pressed', String(hidden));
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstBad = null;
    Array.prototype.forEach.call(form.elements, function (field) {
      if (!checks[field.name]) return;
      touched[field.name] = true;
      if (!validate(field) && !firstBad) firstBad = field;
    });
    if (firstBad) { firstBad.focus(); return; }

    document.getElementById('done-name').textContent = form.elements.name.value.trim().split(/\s+/)[0];
    document.getElementById('done-email').textContent = form.elements.email.value.trim();
    document.getElementById('done-group').textContent = form.elements.group.value.trim().toUpperCase();
    form.hidden = true;
    document.getElementById('form-title').hidden = true;
    done.hidden = false;
    done.focus();
  });

  document.getElementById('again').addEventListener('click', function () {
    form.reset();
    touched = {};
    Array.prototype.forEach.call(form.elements, function (field) {
      if (checks[field.name]) show(field, '');
    });
    updateRules();
    done.hidden = true;
    form.hidden = false;
    document.getElementById('form-title').hidden = false;
    form.elements.name.focus();
  });
})();
