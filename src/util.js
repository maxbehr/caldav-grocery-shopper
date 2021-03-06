export default {
  methods: {
    createDTSTAMP() {
      return new Date().toISOString();
    },
    createUUIDv4() {
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    },
    sanitizeString (str) {
      return str.trim().toLowerCase()
              .replace(' ', '-')
              .replace('\u00e4', 'ae')
              .replace('\u00f6', 'oe')
              .replace('\u00fc', 'ue')
              .replace('\u00df', 'ss');
    },
    createEntryString(entry) {
      let amount = entry.amount > 1 ? entry.amount + 'x ' : '';
      return `${amount + entry.item.label}`;
    },
    /**
     * [createICalEntry description]
     * @param  {[type]} options
     *                   - entry
     *                   - due
     *                   - label
     * @return {[type]}         [description]
     */
    createICalEntry(options) {
      let str = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-
BEGIN:VTODO
DTSTAMP:${this.createDTSTAMP()}
SEQUENCE:1
UID:${this.createUUIDv4()}`;

      str += `${options.due ? '\nDUE:'+options.due+'\n' : ''}`;

      str += `STATUS:NEEDS-ACTION
SUMMARY:${options.label ? options.label : '-'}
END:VTODO
END:VCALENDAR`;

      return str;
    }
  }
}