/* Shared demo roster — used by leaderboard.html (rankings) and profile.html
   (fertility profiles). Replace with real Supabase data at launch.
   Reference ranges loosely follow WHO 6th edition semen analysis norms. */
const SWIMMERS_DATA = [
  {
    slug: 'marcus-t', name: 'Marcus T.', score: 94, color: '#2e7fb4',
    age: 23, tagline: 'Senior, kinesiology — tests every semester',
    trend: '+12% since dry January',
    stats: {
      motility:   { value: 72, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 90 },
      count:      { value: 89, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 88 },
      morphology: { value: 9,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 85 },
      volume:     { value: 3.4,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 80 },
      vitality:   { value: 84, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 86 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '7.8 hr average, consistent schedule', good: true },
      { label: 'Exercise',      note: 'Lifts 4x/week + weekend pickup ball', good: true },
      { label: 'Alcohol',       note: '2–3 drinks, weekends only',           good: true },
      { label: 'Nicotine',      note: 'Never vaped',                          good: true },
      { label: 'Heat exposure', note: 'Laptop on desk, skips the hot tub',   good: true },
      { label: 'Stress',        note: 'Manageable — bad during finals',      good: false }
    ],
    badges: ['💤 8-Hour Club', '🏋️ Gym Rat', '🚭 Nicotine-Free', '🥇 Top Swimmer']
  },
  {
    slug: 'jake-r', name: 'Jake R.', score: 91, color: '#a9d3ea',
    age: 21, tagline: 'Junior, business — intramural everything',
    trend: '+5% this semester',
    stats: {
      motility:   { value: 68, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 85 },
      count:      { value: 76, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 82 },
      morphology: { value: 8,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 78 },
      volume:     { value: 3.1,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 74 },
      vitality:   { value: 80, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 81 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '7 hr, but all-nighters before exams', good: false },
      { label: 'Exercise',      note: 'Intramural soccer + runs 3x/week',    good: true },
      { label: 'Alcohol',       note: 'Thursday–Saturday kind of guy',       good: false },
      { label: 'Nicotine',      note: 'Quit vaping 8 months ago',            good: true },
      { label: 'Heat exposure', note: 'Laptop on desk',                      good: true },
      { label: 'Stress',        note: 'Low — coasts through most weeks',     good: true }
    ],
    badges: ['🏃 Cardio King', '🚭 Quit the Vape', '🥈 Podium Finish']
  },
  {
    slug: 'devon-k', name: 'Devon K.', score: 88, color: '#5ca8d4',
    age: 22, tagline: 'Senior, comp sci — cold shower evangelist',
    trend: '+9% since cutting energy drinks',
    stats: {
      motility:   { value: 65, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 80 },
      count:      { value: 71, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 78 },
      morphology: { value: 7,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 72 },
      volume:     { value: 2.9,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 70 },
      vitality:   { value: 77, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 76 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '6.5 hr — late-night coder',           good: false },
      { label: 'Exercise',      note: 'Daily walks, lifts twice a week',     good: true },
      { label: 'Alcohol',       note: 'Rarely drinks',                       good: true },
      { label: 'Nicotine',      note: 'Never',                               good: true },
      { label: 'Heat exposure', note: 'Was a laptop-on-lap guy. Reformed.',  good: true },
      { label: 'Stress',        note: 'Deadline spikes',                     good: false }
    ],
    badges: ['🧊 Cold Shower Club', '☕ Caffeine Cutback', '🥉 Podium Finish']
  },
  {
    slug: 'alex-p', name: 'Alex P.', score: 84, color: '#10202e',
    age: 20, tagline: 'Sophomore, biology — pre-med grind',
    trend: 'steady all year',
    stats: {
      motility:   { value: 61, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 74 },
      count:      { value: 64, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 72 },
      morphology: { value: 7,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 72 },
      volume:     { value: 2.6,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 64 },
      vitality:   { value: 73, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 70 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '6 hr — organic chemistry is real',    good: false },
      { label: 'Exercise',      note: 'Campus gym 3x/week',                  good: true },
      { label: 'Alcohol',       note: 'Light — too busy studying',           good: true },
      { label: 'Nicotine',      note: 'Never',                               good: true },
      { label: 'Heat exposure', note: 'Library laptop sessions on lap',      good: false },
      { label: 'Stress',        note: 'Pre-med levels (high)',               good: false }
    ],
    badges: ['📚 Study Grinder', '🚭 Nicotine-Free']
  },
  {
    slug: 'sam-w', name: 'Sam W.', score: 79, color: '#7bbede',
    age: 24, tagline: 'Grad student, engineering — meal prep Sundays',
    trend: '+3% since adding zinc',
    stats: {
      motility:   { value: 57, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 66 },
      count:      { value: 52, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 62 },
      morphology: { value: 6,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 60 },
      volume:     { value: 2.4,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 58 },
      vitality:   { value: 68, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 62 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '7 hr, solid routine',                 good: true },
      { label: 'Exercise',      note: 'Bikes to campus daily',               good: true },
      { label: 'Alcohol',       note: 'Craft beer hobbyist (3–4/week)',      good: false },
      { label: 'Nicotine',      note: 'Never',                               good: true },
      { label: 'Heat exposure', note: 'Sauna guy — twice a week',            good: false },
      { label: 'Stress',        note: 'Thesis says hi',                      good: false }
    ],
    badges: ['🥗 Meal Prepper', '🚲 Bike Commuter']
  },
  {
    slug: 'chris-b', name: 'Chris B.', score: 73, color: '#2e7fb4',
    age: 21, tagline: 'Junior, communications — social chair',
    trend: '-4% since rush week',
    stats: {
      motility:   { value: 52, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 56 },
      count:      { value: 41, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 50 },
      morphology: { value: 5,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 48 },
      volume:     { value: 2.2,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 52 },
      vitality:   { value: 62, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 52 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '5–6 hr, wildly inconsistent',         good: false },
      { label: 'Exercise',      note: 'Occasional gym, lots of dancing',     good: false },
      { label: 'Alcohol',       note: 'Social chair duties (frequent)',      good: false },
      { label: 'Nicotine',      note: 'Social vaper, trying to quit',        good: false },
      { label: 'Heat exposure', note: 'Hot tub at the house',                good: false },
      { label: 'Stress',        note: 'Surprisingly chill',                  good: true }
    ],
    badges: ['🍺 Weekend Warrior', '🎯 Most Improvable']
  },
  {
    slug: 'tyler-m', name: 'Tyler M.', score: 66, color: '#5ca8d4',
    age: 22, tagline: 'Senior, undeclared vibes — gamer',
    trend: '+8% since quitting the vape',
    stats: {
      motility:   { value: 46, unit: '% motile',  ref: 'WHO norm: 42%+',  pct: 44 },
      count:      { value: 33, unit: 'M/mL',      ref: 'WHO norm: 16+',   pct: 40 },
      morphology: { value: 4,  unit: '% normal',  ref: 'WHO norm: 4%+',   pct: 36 },
      volume:     { value: 1.9,unit: 'mL',        ref: 'WHO norm: 1.4+',  pct: 40 },
      vitality:   { value: 58, unit: '% alive',   ref: 'WHO norm: 54%+',  pct: 42 }
    },
    lifestyle: [
      { label: 'Sleep',         note: '4 a.m. ranked grind',                 good: false },
      { label: 'Exercise',      note: 'Walking to class counts?',            good: false },
      { label: 'Alcohol',       note: 'Light',                               good: true },
      { label: 'Nicotine',      note: 'Quit vaping 2 months ago 💪',         good: true },
      { label: 'Heat exposure', note: 'Gaming laptop on lap, 6 hr/day',      good: false },
      { label: 'Stress',        note: 'Only when solo queue is bad',         good: true }
    ],
    badges: ['🎮 Reformed Lap-Gamer', '🚭 Quit the Vape', '📈 Biggest Climber']
  }
];
