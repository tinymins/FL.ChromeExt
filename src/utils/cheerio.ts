/**
 * This file is part of vue-boilerplate.
 * @link     : https://zhaiyiming.com/
 * @author   : Emil Zhai (root@derzh.com)
 * @modifier : Emil Zhai (root@derzh.com)
 * @copyright: Copyright (c) 2018 TINYMINS.
 */

interface SelectData {
  value: unknown;
  options: { value: unknown; label: string }[];
}

interface FormInfomation {
  id: string;
  method: 'POST' | 'GET';
  action: string;
  enctype?: string;
  fields: { type: string; data: SelectData }[];
}

const getEl = ($: CheerioStatic, tagName: string, name: string | Cheerio): Cheerio => {
  const $el: Cheerio = typeof name === 'string' ? $(`${tagName}[name="${name}"]`) : name;
  return $el;
};

export const parseSelect = ($: CheerioStatic, name: string | Cheerio): SelectData => {
  const data: SelectData = {
    value: '',
    options: [],
  };
  getEl($, 'select', name).find('option').each((j, elOp) => {
    const $elOp = $(elOp);
    const option = {
      value: $elOp.attr('value'),
      label: $elOp.text(),
    };
    if ($elOp.attr('selected')) {
      data.value = option.value;
    }
    data.options.push(option);
  });
  return data;
};

export const parseSelectValue = ($: CheerioStatic, name: string | Cheerio): unknown => parseSelect($, name).value;

export const parseRadio = ($: CheerioStatic, name: string | Cheerio): SelectData => {
  const data: SelectData = {
    value: '',
    options: [],
  };
  getEl($, 'input', name).each((i, el) => {
    const $el = $(el);
    const option = {
      value: $el.attr('value'),
      label: $el.text(),
    };
    if ($el.attr('checked')) {
      data.value = option.value;
    }
    data.options.push(option);
  });
  return data;
};

export const parseRadioValue = ($: CheerioStatic, name: string | Cheerio): unknown => parseRadio($, name).value;

export const parseTextareaValue = ($: CheerioStatic, name: string | Cheerio): string => getEl($, 'textarea', name).text();
export const parseInputTextValue = ($: CheerioStatic, name: string | Cheerio): string => getEl($, 'input', name).attr('value') || '';
export const parseInputHiddenValue = ($: CheerioStatic, name: string | Cheerio): string => getEl($, 'input', name).attr('value') || '';

export const parseForm = ($, selector): FormInfomation => {
  const form: FormInfomation = {
    id: '',
    method: 'POST',
    action: '',
    fields: [],
  };
  const $form = $(selector);
  $form.find('input').each((_, el) => {
    const $el = $(el);
    const name = $el.attr('name');
    const type = $el.attr('type');
    if (name) {
      if (type === 'radio') {
        form.fields.push({ type: 'radio', data: parseRadio($, $el) });
      } else if (type === 'file') {
        form[name] = $el.attr('index-name');
      } else if (type !== 'submit') {
        form[name] = $el.attr('value');
      }
    }
  });
  $form.find('select').each((_, el) => {
    const $el = $(el);
    $el.find('option').each((_, elOp) => {
      const $elOp = $(elOp);
      if ($elOp.attr('selected')) {
        form[$el.attr('name')] = $elOp.attr('value');
      }
    });
  });
  $form.find('textarea').each((i, el) => {
    const $el = $(el);
    form[$el.attr('name')] = $el.text();
  });
  return form;
};
