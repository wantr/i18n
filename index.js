// определение языка
//  из get-параметра урла
//  из куки
//  из домена
//  из настройки пользователя
var list = require('./list');

function I18N(req) {
    this.locales = list;
    this.setLocale(req);
    this.setDictionary();
};

I18N.prototype = {
    /**
     * @param {?HTTP.Request}
     */
    setLocale: function setLocale(req) {
        var ret;

        if (req) {
            if (req.query && req.query.locale) {
                ret = req.query.locale;
                this.localeFrom = 'url';
            } else if (req.cookies && req.cookies['set-locale']) {
                ret = req.cookies['set-locale'];
                this.localeFrom = 'cookie';
            }    
        }

        this.lang = Object.keys(this.locales).indexOf(ret) === -1 ? 'en' : ret;
    },

    getLocale: function getLocale() {
        return this.lang;
    },

    /**
     * @param {String} key
     * @param {String{}} [data]
     * @return {String}
     */
    get: function get(key, data) {
        var str = this.dictionary[key] || ''

        if ( ! data) {
            return str;
        }

        var re = new RegExp('\{\{(\\w+)\}\}', 'g');

        return str.replace(re, function(all, k) {
            return data[k] || '';
        });
    },

    setDictionary: function setDictionary() {
        if ( ! this.lang) {
            throw new Error('I18N ERROR: lang required');
        }

        this.dictionary = require('./dict/' + this.lang);
    }
};

module.exports = I18N;
