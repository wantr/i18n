var list = require('./list');

const DEFAULT_LANGUAGE = 'ru';

function I18N(req) {
    this.locales = list;
    this.setLocale(req);
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
            } else if (req.user && req.user.locale) {
                ret = req.user.locale;
                this.localeFrom = 'user';
            } else if (req.cookies && req.cookies.locale) {
                ret = req.cookies.locale;
                this.localeFrom = 'cookie';
            }
        }

        this.lang = Object.keys(this.locales).indexOf(ret) === -1 ? DEFAULT_LANGUAGE : ret;

        this.dictionary = require('./dict/' + this.lang);
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
    }
};

module.exports = I18N;
