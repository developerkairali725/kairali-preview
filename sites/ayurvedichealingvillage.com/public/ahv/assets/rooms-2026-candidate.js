// 2026 accommodation candidate (WOPS-AHV-CLAUDE-CONTINUATION-002, 24 Sep 2026).
// Source: Kairali Digital/AHV-GALLERY-ROOMS-2026-09-24/room-features-20260924/ROOM-FEATURES-COPY.md + OWNER-FACTS-2026.json.
// Derives candidate data from the accepted per-page data files WITHOUT mutating them.
// Not changed: area ranges, "Upto N Adults" chips, room names/numbers, villa bed mappings, galleries, rates.
(function () {
  var bathroom = ['Hairdryer', 'Toiletries', 'Bath, hand and face towels', 'Bathrobe', 'Bath mat'];
  var extras = ['Drinking water', 'Tissue box', 'Stationery', 'Two umbrellas'];
  var villa = {
    groups: [
      { title: 'Room and comfort', items: ['King or twin beds, depending on the villa', 'Wardrobe', 'Air conditioning', 'LED television'] },
      { title: 'Bathroom essentials', items: ['Attached bathroom'].concat(bathroom) },
      { title: 'Useful extras', items: extras }
    ],
    layouts: []
  };
  var suite = {
    groups: [
      { title: 'Comfort', items: ['Air conditioning', 'LED television', 'Refrigerator in both suites 1001 and 1002', 'Coffee maker in both suites 1001 and 1002'] },
      { title: 'Bathroom essentials', items: bathroom },
      { title: 'Useful extras', items: extras }
    ],
    layouts: [
      { suite: 'Suite 1001', title: 'King bedroom and separate living room',
        items: ['One bedroom with a king-size bed', 'A separate living room', 'Two bathrooms — one for each room', 'Two wardrobes — one in each room'] },
      { suite: 'Suite 1002', title: 'Two bedrooms',
        items: ['One bedroom with a king-size bed', 'One bedroom with twin beds', 'Two bathrooms — one for each bedroom', 'Two wardrobes — one in each bedroom'] }
    ]
  };
  function clone(o) { return JSON.parse(JSON.stringify(o)); }
  window.AHV_ROOMS_2026 = {
    features: function (key) { return clone(key === 'maharaja' ? suite : villa); },
    apply: function (key, src) {
      var D = clone(src);
      if (key !== 'maharaja') return D;
      // Summary chip: vague "Twin/King Size Bed" -> "Two suite layouts". Other chips unchanged.
      D.facts = D.facts.map(function (f) { return f === 'Twin/King Size Bed' ? 'Two suite layouts' : f; });
      // About ¶2 first sentence corrected to owner facts; remainder verbatim.
      D.aboutBlocks = D.aboutBlocks.map(function (b) {
        if (b.type === 'p' && b.text.indexOf('There are two separate rooms in the suite, one of which has an impressive king-size bed.') === 0) {
          return { type: 'p', text: b.text.replace('There are two separate rooms in the suite, one of which has an impressive king-size bed.',
            'There are two suite layouts. Suite 1001 has a bedroom with a king-size bed and a separate living room; Suite 1002 has two bedrooms, one with a king-size bed and one with twin beds. Each suite has two bathrooms and two wardrobes, one of each in each room.') };
        }
        return b;
      });
      // Room table: names/numbers/photos unchanged; layout text per owner facts.
      D.rooms = D.rooms.map(function (r) {
        if (r.room === '1001') r.bed = 'King bedroom and separate living room';
        if (r.room === '1002') r.bed = 'King bedroom and twin bedroom';
        return r;
      });
      return D;
    }
  };
})();
