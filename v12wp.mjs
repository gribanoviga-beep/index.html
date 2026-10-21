// ╔══════════════════════════════════════════════╗
// ║            𝘽𝘼𝘿𝘼𝙇 𝙓 𝙂𝙊𝙅𝙊 🫯                ║
// ║          ⚡ ULTIMATE WHATSAPP BOT ⚡            ║
// ║          📊 POLL & GROUP TOOLS                  ║
// ║          🛡️ SMART AUTOMATION CORE               ║
// ║          🔥 CUSTOM COMMAND SYSTEM               ║
// ╚══════════════════════════════════════════════╝
import makeWASocket, {
    useMultiFileAuthState,
    DisconnectReason,
    delay,
    fetchLatestBaileysVersion,
    Browsers,
    downloadMediaMessage
} from '@whiskeysockets/baileys';
import { Boom }          from '@hapi/boom';
import pino              from 'pino';
import fs                from 'fs';
import readline          from 'readline';
import gtts              from 'node-gtts';
import { spawnSync }     from 'child_process';
import ffmpegPath        from 'ffmpeg-static';

// ─────────────────────────────────────────────
//  STORAGE PATHS
// ─────────────────────────────────────────────
const PATH_AUTH    = (id) => `./sessions/${id}`;
const PATH_USERS   = './store/users.json';
const PATH_NETWORK = './store/network.json';
const PATH_TIMING  = './store/timing.json';
const PATH_ARISE   = './store/arise.json';
const PATH_THEMES  = './store/themes.json';

// ─────────────────────────────────────────────
//  EMOJI BANKS  (name-change sets)
// ─────────────────────────────────────────────
const SETS = {
    faces:   ['🤡','🥸','😶‍🌫️','🫠','🥴','🤑','😈','👿','😵‍💫','🤧','🥲','😬','🫡','🧑‍💻','🧐'],
    hearts:  ['🎋','🎍','🪴','🎑','🌾','🍀','🌴','🪦','🌵','🎄','🍄','🍃','🌿','🍁','🌴'],
    hands:   ['🍕','🍔','🌮','🍜','🍣','🍩','🧁','🍰','🧋','🥞','🫔','🥙','🧆','🥗','🫕'],
    flowers: ['🏗️','🏚️','🏠','🏡','🏢','🏣','🏤','🏥','🏦','🏧','🏨','🏩','🏪','🏫','🏬'],
    sky:     ['⚽','🏀','🏈','⚾','🎾','🏐','🏐','🥏','🎱','🏑','🏒','🥍','🏸','🥊','🪃'],
    animals: ['🎸','🎹','🎺','🎻','🥁','🪕','🎷','🪗','🎙️','🎚️','🎛️','📻','🪘','🪈','🎼'],
    fruits:  ['🚂','🛳️','🏎️','🚁','🛻','🚡','🛶','🚤','🚠','🛺','🚜','🏍️','🛵','🚲','🛴'],
};

const FLAG_CYCLE = [
    '🇳🇵','🇧🇩','🇱🇰','🇲🇾','🇹🇭','🇻🇳','🇵🇭','🇮🇩','🇸🇬','🇰🇿',
    '🇺🇿','🇦🇿','🇬🇪','🇮🇶','🇮🇷','🇸🇾','🇯🇴','🇱🇧','🇾🇪','🇲🇳'
];

const EMO_CYCLE = [
    '🪬','🧿','🪩','🪸','🪼','🫎','🪿','🦤','🪭','🪮',
    '🪈','🪗','🪘','🪃','🪁','🫙','🪣','🫗','🪤','🪆'
];

const WORD_CYCLE = [
' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 ⚛️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 👾', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🤖', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖖', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🦠', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 ⚡', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🤍', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🤍', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🦁', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🫪', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🤍', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 👞', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🎩', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔥', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖤', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🤡', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🥸', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 😶‍🌫️', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🫠', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🥴', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🤑', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 😈', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 👿', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 😵‍💫', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🤧', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🥲', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 😬', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🫡', ' 𝐂ʜʟ 𝐇ᴀʀᴍᴢᴀᴅ𝐈 𝐊ᴇ लड़के 🧑‍💻', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🎋', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🎍', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🪴', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🎑', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🌾', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🍀', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🌴', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🪦', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🌵', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🎄', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🍄', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🍃', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🌿', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? 🍁', ' 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? ⚡', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🍕', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🍔', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🌮', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🍜', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🍣', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🍩', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🧁', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🍰', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🧋', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🥞', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🫔', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🥙', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🧆', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🥗', ' 𝐂ʜᴀᴍᴀʀ 𝐁ɪɴ𝐀 𝐏ᴜᴄʜ𝐄 𝐑ᴇᴘʟ𝐘 𝐌ᴀ𝐓 𝐊ɪʏ𝐀 𝐊ᴀ𝐑 𝐃ᴀʟɪ𝐓 🫕', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- ⚽', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏀', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏈', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- ⚾', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🎾', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏐', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏉', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🥏', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🎱', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏑', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏒', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🥍', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🏸', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🥊', ' 𝐂𝐇𝐔𝐏 𝐑𝐍𝐃𝐈𝐊𝐄/- 🪃', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎸', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎹', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎺', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎻', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🥁', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🪕', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎷', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🪗', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎙️', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎚️', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎛️', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 📻', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🪘', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🪈', ' ʙꪊʟʟꪗ केन्द्र 😂👋🏻 🎼', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🤮꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁💀꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🤡꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁😈꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁👿꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🔥꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁💩꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🐷꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🦧꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🐍꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🪳꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🐀꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁🤢꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙 ꧁👹꧂', ' 𝘽𝘼𝙐𝙉𝙀 मादरचोद 💙', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ ⛈️', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌪️', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌈', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ ☀️', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌙', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ ⭐', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌟', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 💫', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ ☄️', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🔥', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ ❄️', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌊', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌀', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ 🌤️', ' 𝐋ᴇ 𝐀ʙʜ 𝐆ᴏᴊᴏ 𝐏ᴀᴘᴀ 𝐊ᴇ 𝐅ᴏɴᴛs 𝐌ᴇ 𝐂ʜᴜᴅ 𓀿︎𓀐︎ ⚡', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🏴', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🏳️', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🚩', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🏁', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🎌', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🔥', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ ⚡', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 💀', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🇮🇳', '#𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 😈', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 👿', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🤡', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 🤮', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ 💩', ' #𝐒ᴜɴ #𝐑ᴀɴᴅɪ #𝐊ᴇ #𝐀ᴀᴊ #𝐓ᴇʀɪ #𝐌ᴀᴀ #𝐁ʜɪ #𝐂ʜᴜᴅᴇɢɪ #𝐎ʀ #𝐓ᴇʀɪ #𝐁ᴀʜᴀɴ #𝐁ʜɪ ☠️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 💻', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖥️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 ⌨️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖨️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖱️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 💿', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📱', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📡', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔌', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔋', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 💡', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔦', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📸', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🎥', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📺', 
];

// ─────────────────────────────────────────────
//  CUSTOM RANDOM SLIDE PHRASES
// ─────────────────────────────────────────────
const CUSTOM_SLIDE_LINES = [
    'GOJO KE SAMNE TU BACHA HAI GARIB ',
    'AUKAT ME RAH GARIB 🤣✋🏻',
    'BOL GOJO PAPA MAHAAN HAI ',
    ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 💻', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖥️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 ⌨️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖨️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖱️',' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 💿', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📱', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📡', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔌',' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔋', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 💡', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🔦', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📸', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🎥', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 📺', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 ⚛️', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 👾', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🤖', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🖖', ' ᴛᴇʀɪ ᶜʰⁱⁿᵃᵃʳ ᵐᵃᵃ ᵏᵒ लकड़गंज ˡᵉ ʲᵃᵃᵏᵉ ᶜʰᵘᵈʷᵃ दूंगा 𝐑ɴ𝐃ɪ𝐊🦖💨🔥 😑👌🏻 🦠', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 'Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊', 
    
];

// ─────────────────────────────────────────────
//  4 CORE WAR STYLES (15 Lines in Every Message)
// ─────────────────────────────────────────────
const WAR_4_STYLES = [
    '➥ Aᴀᴊ Mᴀɪɴ Kʜᴀᴋᴇ  Bᴜʀɢᴇʀ 🍔 {TARGET} Kɪ Mᴀᴀ Cʜᴏᴅᴜɴɢᴀ Gʜᴀʀ Gʜᴀʀ',
    '{TARGET} ⇥ Tᴇʀɪ Bʜᴇɴ Kᴀ Pɪɴᴋ Bʜᴏꜱᴅᴀ 💓',
    '{TARGET}⇥ TᗴᖇI ᗰᗩ K ᑕᕼᑌT ᑭᗩᖇ Tᕼᗩᑭᑭᗩᗪ ᗰᗩᖇᑌᑎᘜᗩ ᖇᑎᗪYKᗴ ༆𖣔',
   ' {TARGET} Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊',  
   '{TARGET} 𝐓ᴇʀ𝐈 𝐌ᴀ𝐀 𝐊ᴇ 𝐂ʜᴜᴄʜ𝐄 𝐊ʜ𝐀 𝐉ᴀ𝐔?? ⚡',
     ' {TAGET} Oye रंडीके ये देख तेरी मां की चूदाई 📌 हो रही है 🌊',
          ]

/**
 * 15 Lines Generator with *Bold* format & Double Spacing
 */
function render15LineBomb(templateStr, targetName) {
    const cleanTarget = (targetName || '').trim() || 'TARGET';
    const singleLine = templateStr.replace(/\{TARGET\}/g, cleanTarget);
    const lines = [];
    for (let i = 0; i < 15; i++) {
        lines.push(`*${singleLine}*`);
    }
    return lines.join('\n\n');
}

/**
 * Parses target and millisecond delay from command arguments
 * Example: .spam जैक - लवी 500
 */
function parseTargetAndMs(args, defaultMs = 500) {
    if (!args || args.length === 0) {
        return { target: 'जैक - लवी', ms: defaultMs };
    }

    const last = args[args.length - 1];
    if (/^\d+$/.test(last)) {
        const msVal = parseInt(last, 10);
        const nameParts = args.slice(0, args.length - 1);
        const target = nameParts.join(' ').trim() || 'जैक - लवी';
        return { target, ms: Math.max(msVal, 10) };
    }

    return { target: args.join(' ').trim() || 'जैक - लवी', ms: defaultMs };
}

// ─────────────────────────────────────────────
//  FONT CONVERTER  (small caps)
// ─────────────────────────────────────────────
const GLYPH = {
    a:'ᴀ',b:'ʙ',c:'ᴄ',d:'ᴅ',e:'ᴇ',f:'ғ',g:'ɢ',h:'ʜ',i:'ɪ',j:'ᴊ',k:'ᴋ',l:'ʟ',
    m:'ᴍ',n:'ɴ',o:'ᴏ',p:'ᴘ',q:'ǫ',r:'ʀ',s:'ꜱ',t:'ᴛ',u:'ᴜ',v:'ᴠ',w:'ᴡ',x:'x',y:'ʏ',z:'ᴢ',
    A:'ᴀ',B:'ʙ',C:'ᴄ',D:'ᴅ',E:'ᴇ',F:'ғ',G:'ɢ',H:'ʜ',I:'ɪ',J:'ᴊ',K:'ᴋ',L:'ʟ',
    M:'ᴍ',N:'ɴ',O:'ᴏ',P:'ᴘ',Q:'ǫ',R:'ʀ',S:'ꜱ',T:'ᴛ',U:'ᴜ',V:'ᴠ',W:'ᴡ',X:'x',Y:'ʏ',Z:'ᴢ'
};
const g = str => str.split('').map(c => GLYPH[c] ?? c).join('');

// ─────────────────────────────────────────────
//  READABLE DARK FONT
// ─────────────────────────────────────────────
const DRAGON_GLYPH = {
    A:'𝗔',B:'𝗕',C:'𝗖',D:'𝗗',E:'𝗘',F:'𝗙',G:'𝗚',H:'𝗛',I:'𝗜',J:'𝗝',K:'𝗞',L:'𝗟',
    M:'𝗠',N:'𝗡',O:'𝗢',P:'𝗣',Q:'𝗤',R:'𝗥',S:'𝗦',T:'𝗧',U:'𝗨',V:'𝗩',W:'𝗪',X:'𝗫',
    Y:'𝗬',Z:'𝗭',
    a:'𝗮',b:'𝗯',c:'𝗰',d:'𝗱',e:'𝗲',f:'𝗳',g:'𝗴',h:'𝗵',i:'𝗶',j:'𝗷',k:'𝗸',l:'𝗹',
    m:'𝗺',n:'𝗻',o:'𝗼',p:'𝗽',q:'𝗾',r:'𝗿',s:'𝘀',t:'𝘁',u:'𝘂',v:'𝘃',w:'𝘄',x:'𝘅',
    y:'𝘆',z:'𝘇',
    0:'𝟬',1:'𝟭',2:'𝟮',3:'𝟯',4:'𝟰',5:'𝟱',6:'𝟲',7:'𝟳',8:'𝟴',9:'𝟵'
};
const dark = str => [...String(str)].map(c => DRAGON_GLYPH[c] ?? c).join('');

// ─────────────────────────────────────────────
//  HALT FONT CONVERTER (Bold Serif + Small Caps like 𝐇ᴀʟᴛ)
// ─────────────────────────────────────────────
const BOLD_SERIF = {
    A:'𝐀',B:'𝐁',C:'𝐂',D:'𝐃',E:'𝐄',F:'𝐅',G:'𝐆',H:'𝐇',I:'𝐈',J:'𝐉',K:'𝐊',L:'𝐋',
    M:'𝐌',N:'𝐍',O:'𝐎',P:'𝐏',Q:'𝐐',R:'𝐑',S:'𝐒',T:'𝐓',U:'𝐔',V:'𝐕',W:'𝐖',X:'𝐗',
    Y:'𝐘',Z:'𝐙',
    0:'𝟎',1:'𝟏',2:'𝟐',3:'𝟑',4:'𝟒',5:'𝟓',6:'𝟔',7:'𝟕',8:'𝟖',9:'𝟗'
};
const haltFont = str => str.replace(/[A-Za-z0-9]/g, (c, idx, full) => {
    if (/[0-9]/.test(c)) return BOLD_SERIF[c] ?? c;
    const isStart = idx === 0 || !/[A-Za-z]/.test(full[idx - 1]);
    if (isStart || /[A-Z]/.test(c)) return BOLD_SERIF[c.toUpperCase()] ?? c;
    return GLYPH[c.toLowerCase()] ?? c;
});

// ─────────────────────────────────────────────
//  MENU — ORNATE NEXUS COMMAND DECK
// ─────────────────────────────────────────────
const MENU_TEXT = (hub=null) => {
    const fleet = hub?.router?.getAll?.() || [];
    const online = fleet.filter(s=>s.online).length;
    const fleetText = fleet.length ? (online + '/' + fleet.length + ' 𝐀ᴄᴛɪᴠᴇ') : '𝐑ᴇᴀᴅʏ';

    return `╔═══━━━ 𓆩⚡𓆪 ━━━═══╗
𝙂𝙊𝙅𝙊 𝙓 𝘽𝙃𝘼𝙒𝘼𝙉
🫯 𝗨𝗟𝗧𝗜𝗠𝗔𝗧𝗘 𝗟𝗘𝗚𝗘𝗡𝗗 🫯
╚═══━━━ 𓆩🐦‍🔥𓆪 ━━━═══╝

╭━━━〔 🐦‍🔥 〕 𝗡𝗘𝗫𝗨𝗦 𝗦𝗬𝗦𝗧𝗘𝗠
┃
┃ 𖤐 𝗕𝗢𝗧      » 𝙂𝙊𝙅𝙊 𝙓 𝘽𝙃𝘼𝙒𝘼𝙉
┃ 🫯 𝗢𝗪𝗡𝗘𝗥    » 𝗙𝗜𝗥𝗦𝗧 𝗔𝗗𝗠𝗜𝗡
┃ ⚙️ 𝗣𝗥𝗘𝗙𝗜𝗫   » 𝗖𝗨𝗦𝗧𝗢𝗠
┃ 🟢 𝗠𝗢𝗗𝗘     » 𝗨𝗟𝗧𝗥𝗔 𝗖𝗢𝗥𝗘
┃ 🤖 𝗙𝗟𝗘𝗘𝗧    » ${fleetText}
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🚀 〕 𝗤𝗨𝗜𝗖𝗞 𝗔𝗖𝗖𝗘𝗦𝗦
┃ 𝟬𝟭 ➤ 𝗮𝗱𝗺𝗶𝗻
┃ 𝟬𝟮 ➤ 𝗺𝗲𝗻𝘂
┃ 𝟬𝟯 ➤ 𝗽𝗶𝗻𝗴
┃ 𝟬𝟰 ➤ 𝗮𝗹𝗶𝘃𝗲
┃ 𝟬𝟱 ➤ 𝗹𝗶𝘃𝗲
┃ 𝟬𝟲 ➤ 𝗸𝗶𝗹𝗹𝗮𝗹𝗹
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🔐 〕 𝗔𝗗𝗠𝗜𝗡 𝗖𝗢𝗥𝗘
┃ 🫯 𝗮𝗱𝗺𝗶𝗻       » Claim Admin
┃ 🔒 𝘂𝗻𝗮𝗱𝗺𝗶𝗻     » Remove Admin
┃ 🛡️ 𝘀𝘂𝗯         » Promote Replied User
┃ ⚔️ 𝘂𝗻𝘀𝘂𝗯       » Remove Promotion
┃ 🤖 𝗮𝗱𝗱𝗯𝗼𝘁      » Link New Bot
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 📊 〕 𝗣𝗢𝗟𝗟 𝗦𝗬𝗦𝗧𝗘𝗠
┃ ▸ 𝗽𝗼𝗹𝗹 [Q] | [O1] | [O2]
┃ ▸ 𝗺𝗽𝗼𝗹𝗹 [Q] | [O1] | [O2]
┃ ▸ 𝗽𝗼𝗹𝗹𝗮𝘁𝗸 [Q]|[O1]|[O2]|[MS]
┃ ▸ 𝘀𝘁𝗼𝗽𝗽𝗼𝗹𝗹
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🧩 〕 𝗨𝗧𝗜𝗟𝗜𝗧𝗬 𝗛𝗨𝗕
┃ ⚡ 𝗳𝗱𝗲𝘀𝗰 [TEXT]
┃ 🛑 𝘀𝘁𝗼𝗽𝗳𝗱𝗲𝘀𝗰
┃ 🖼️ 𝗴𝗰𝗽𝗳𝗽
┃ 🔎 𝘆𝘁𝘀 [QUERY]
┃ 📢 𝗮𝗿𝗶𝘀𝗲
┃ 🎬 𝘀𝗵𝗼𝘄𝗰𝗮𝘀𝗲
┃ 👥 𝗴𝗿𝗼𝘂𝗽𝗶𝗻𝗳𝗼
┃ 📡 𝘀𝘁𝗮𝘁𝘂𝘀
┃ 🎨 𝘁𝗵𝗲𝗺𝗲 [NAME]
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🎭 〕 𝗔𝗡𝗜𝗠𝗔𝗧𝗜𝗢𝗡 𝗟𝗔𝗕
┃ ▸ 𝗹𝗼𝗮𝗱𝗶𝗻𝗴
┃ ▸ 𝘀𝗽𝗶𝗻𝗻𝗲𝗿
┃ ▸ 𝗰𝗼𝘂𝗻𝘁𝗱𝗼𝘄𝗻 [N]
┃ ▸ 𝘁𝘆𝗽𝗲𝘄𝗿𝗶𝘁𝗲 [TEXT]
┃ ▸ 𝗴𝗹𝗶𝘁𝗰𝗵 [TEXT]
┃ ▸ 𝗳𝗮𝗸𝗲𝗯𝗮𝗻
┃ ▸ 𝗳𝗮𝗸𝗲𝗸𝗶𝗰𝗸
┃ ▸ 𝗳𝗮𝗸𝗲𝘄𝗮𝗿𝗻
┃ ▸ 𝗳𝗮𝗸𝗲𝗱𝗺
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🎨 〕 𝗠𝗘𝗗𝗜𝗔 𝗦𝗧𝗨𝗗𝗜𝗢
┃ 🪄 𝗮𝗶𝗶𝗺𝗴 [PROMPT]
┃ 🎵 𝘀𝗼𝗻𝗴 [NAME]
┃ 🛡️ 𝗳𝗹𝗼𝗼𝗱𝗯𝘆𝗽𝗮𝘀𝘀
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 ⚔️ 〕 𝗡𝗔𝗠𝗘 𝗔𝗥𝗦𝗘𝗡𝗔𝗟
┃ 🤡 𝗳𝟭 [TEXT] » Cursed Faces
┃ 🎋 𝗳𝟮 [TEXT] » Plants
┃ 🍕 𝗳𝟯 [TEXT] » Food & Drinks
┃ 🏠 𝗳𝟰 [TEXT] » Buildings
┃ ⚽ 𝗳𝟱 [TEXT] » Sports
┃ 🎸 𝗳𝟲 [TEXT] » Music
┃ 🚂 𝗳𝟳 [TEXT] » Vehicles
┃ 🛑 𝗳𝘀𝘁𝗼𝗽
┃ 🐦‍🔥 𝗮𝗹𝗹𝗻𝗰 [TEXT]
┃ ⛔ 𝘀𝘁𝗼𝗽𝗮𝗹𝗹𝗻𝗰
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🌀 〕 𝗖𝗬𝗖𝗟𝗘 𝗘𝗡𝗚𝗜𝗡𝗘
┃ ⚡ 𝗻𝗰 [TEXT]
┃ 🛑 𝘀𝘁𝗼𝗽𝗻𝗰
┃ 🚩 𝗰𝗼𝗻𝗲𝗺𝗼 [TEXT]
┃ 🛑 𝘀𝘁𝗼𝗽𝗰𝗼𝗻𝗲𝗺𝗼
┃ ✨ 𝗻𝗰𝗲𝗺𝗼 [TEXT]
┃ 🛑 𝘀𝘁𝗼𝗽𝗻𝗰𝗲𝗺𝗼
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 💬 〕 𝗠𝗘𝗦𝗦𝗔𝗚𝗘 𝗖𝗢𝗥𝗘
┃ ▸ 𝘀𝗽𝗮𝗺 [TARGET] [MS]
┃ ▸ 𝘀𝘁𝗼𝗽𝘀𝗽𝗮𝗺
┃ ▸ 𝘀𝘄𝗶𝗽𝗲 [REPLY]
┃ ▸ 𝘀𝘁𝗼𝗽𝘀𝘄𝗶𝗽𝗲
┃ ▸ 𝘁𝘅𝘁 [TEXT] [MS]
┃ ▸ 𝘀𝘁𝗼𝗽𝘁𝘅𝘁
┃ ▸ 𝘀𝗹𝗶𝗱𝗲 [TEXT] [MS]
┃ ▸ 𝘀𝘁𝗼𝗽𝘀𝗹𝗶𝗱𝗲
┃ ▸ 𝗿𝘀𝗹𝗶𝗱𝗲 [MS]
┃ ▸ 𝘀𝘁𝗼𝗽𝗿𝘀𝗹𝗶𝗱𝗲
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 🎤 〕 𝗩𝗢𝗜𝗖𝗘 & 𝗠𝗘𝗗𝗜𝗔
┃ 🎙️ 𝘃𝗼𝗶𝗰𝗲 [TEXT]
┃ 🔊 𝘃𝗼𝗶𝗰𝗲𝗮𝘁𝗸 [TEXT] [MS]
┃ 🛑 𝘀𝘁𝗼𝗽𝘃𝗼𝗶𝗰𝗲
┃ 🖼️ 𝗶𝗺𝗴 [MS]
┃ 🛑 𝘀𝘁𝗼𝗽𝗶𝗺𝗴
╰━━━━━━━━━━━━━━━━━━╯

╭━━〔 ⏱️ 〕 𝗦𝗣𝗘𝗘𝗗 𝗖𝗢𝗡𝗧𝗥𝗢𝗟
┃ ⚙️ 𝘀𝗽𝗲𝗲𝗱 [F1-F7] [MS]
┃ 📋 𝘄𝗼𝗿𝗱𝘀
┃ 📡 𝗮𝗹𝗶𝘃𝗲
┃ ⚡ 𝗽𝗶𝗻𝗴
┃ 🟢 𝗹𝗶𝘃𝗲
┃ 🛑 𝗸𝗶𝗹𝗹𝗮𝗹𝗹
┃ 📖 𝗺𝗲𝗻𝘂
╰━━━━━━━━━━━━━━━━━━╯

╭━━━━━━〔 🐦‍🔥 〕━━━━━━╮
𓆩⚡𓆪 𝗚𝗢𝗝𝗢 𝗫 𝗕𝗛𝗔𝗪𝗔𝗡
 𝗖𝗢𝗡𝗧𝗥𝗢𝗟 𝗧𝗛𝗘 𝗦𝗬𝗦𝗧𝗘𝗠
╰━━━━━━〔 🫯 〕━━━━━━╯⋆`;
};

// ─────────────────────────────────────────────
// ─────────────────────────────────────────────
// ⚡ GOJO X BHAWAN — NOTIFICATION STRINGS
// ─────────────────────────────────────────────

const TAG = "╔═══━━━ 𓆩⚡𓆪 ━━━═══╗\n『 🐦‍🔥 𝐆𝐎𝐉𝐎 𝐗 𝐁𝐇𝐀𝐖𝐀𝐍 𝐕𝟏𝟐 🛡️ 』\n『 🫯 𝐔𝐋𝐓𝐈𝐌𝐀𝐓𝐄 𝐃𝐀𝐑𝐊 𝐂𝐎𝐑𝐄 🫯 』\n╚═══━━━ 𖤐🔥𖤐 ━━━═══╝";

const win = what => `${TAG}

╭━━━〔 ⚡ 𝐕𝐈𝐂𝐓𝐎𝐑𝐘 〕━━━╮
┃ 𓆩🫯𓆪 ${dark(what)}
┃ 🟢 ${dark('𝐒𝐘𝐒𝐓𝐄𝐌 𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃')}
╰━━━〔 🐦‍🔥 𝐆𝐎𝐉𝐎 〕━━━╯

『 ✦ 𝐆𝐎𝐉𝐎 𝐗 𝐁𝐇𝐀𝐖𝐀𝐍 ✦ 』`;

const lose = what => `${TAG}

╭━━━〔 🛑 𝐃𝐄𝐅𝐄𝐀𝐓 〕━━━╮
𓆩⚔️𓆪 ${dark(what)}
🔴 ${dark('𝐒𝐘𝐒𝐓𝐄𝐌 𝐃𝐄𝐀𝐂𝐓𝐈𝐕𝐀𝐓𝐄𝐃')}
╰━━━〔 🐦‍🔥 𝐃𝐀𝐑𝐊 𝐂𝐎𝐑𝐄 〕━━━╯

『 ✦ 𝐆𝐎𝐉𝐎 𝐗 𝐁𝐇𝐀𝐖𝐀𝐍 ✦ 』`;

const HALT_MESSAGE = killed => `${TAG}

╔═══════ 𓆩🐦‍🔥𓆪 ═══════╗
${dark('GOJO BHAGWAN')}
${dark('EMERGENCY HALT')}
╚═══════ 𖤐⚡𖤐 ═══════╝

╭━━━〔 🛑 〕━━━╮
┃ ${g('ALL ACTIVE LOOPS STOPPED')}
┃ ⚡ ${dark('PROCESSES HALTED')}
┃ 📊 ${dark('STOPPED COUNT')}: ${killed}
╰━━━━━━━━━━━━━━╯

𓆩🫯𓆪 ${dark('GOJO X BHAWAN')}
『 UPGRADE V12 』`;

// ─────────────────────────────────────────────
//  PERSISTENCE HELPERS
// ─────────────────────────────────────────────
const ensureDir = p => { const d=p.includes('/')?p.substring(0,p.lastIndexOf('/')):'.'; if(!fs.existsSync(d))fs.mkdirSync(d,{recursive:true}); };
const readJson  = (p,def) => { try{ if(fs.existsSync(p)) return JSON.parse(fs.readFileSync(p,'utf8')); }catch{} return {...def}; };
const writeJson = (p,d)   => { try{ ensureDir(p); fs.writeFileSync(p,JSON.stringify(d,null,2)); }catch{} };

let userData  = readJson(PATH_USERS,  { owners:[], subs:{} });
// Keep the access store usable even when the file is missing, empty, or
// was written by an older version with a different shape.
if(!userData || typeof userData !== 'object' || Array.isArray(userData)) userData={};
if(!Array.isArray(userData.owners)) userData.owners=[];
if(!userData.subs || typeof userData.subs !== 'object' || Array.isArray(userData.subs)) userData.subs={};
let timingMap = readJson(PATH_TIMING, { f1:0,f2:0,f3:0,f4:0,f5:0,f6:0,f7:0 });
let ariseData = readJson(PATH_ARISE, {});
let themeData = readJson(PATH_THEMES, {});
const THEMES = {
    cyber:   {label:'CYBER',   icon:'⚡', glyph:'░▒▓'},
    inferno: {label:'INFERNO', icon:'🔥', glyph:'▓█▓'},
    ice:     {label:'ICE',     icon:'❄️', glyph:'·˚·'}
};
for(const key of ['f1','f2','f3','f4','f5','f6','f7']) timingMap[key]=0;

const saveUsers  = () => writeJson(PATH_USERS,  userData);
const saveTiming = () => writeJson(PATH_TIMING, timingMap);
const saveArise  = () => writeJson(PATH_ARISE, ariseData);

const isOwner = j     => userData.owners.includes(j);
const saveThemes = () => writeJson(PATH_THEMES, themeData);
const getTheme   = chat => THEMES[themeData[chat]] || THEMES.cyber;
const isSub   = (j,g) => userData.subs[g]?.includes(j) || false;
const canUse  = (j,g) => isOwner(j) || isSub(j,g);

const grantOwner = j => { if(!userData.owners.includes(j)){userData.owners.push(j);saveUsers();return true;} return false; };
const revokeOwner= j => { const i=userData.owners.indexOf(j);if(i>-1){userData.owners.splice(i,1);saveUsers();return true;}return false; };
const grantSub   = (j,grp) => { if(!userData.subs[grp])userData.subs[grp]=[]; if(!userData.subs[grp].includes(j)){userData.subs[grp].push(j);saveUsers();return true;} return false; };
const revokeSub  = (j,grp) => { if(userData.subs[grp]){const i=userData.subs[grp].indexOf(j);if(i>-1){userData.subs[grp].splice(i,1);saveUsers();return true;}} return false; };

const SET_KEYS = { f1:'faces',f2:'hearts',f3:'hands',f4:'flowers',f5:'sky',f6:'animals',f7:'fruits' };
const ALL_NC_EMOJIS = Object.values(SETS).flat();
const ALL_NC_DELAY = 1000;

// ─────────────────────────────────────────────
//  TTS HELPER
// ─────────────────────────────────────────────
const HAS_FFMPEG = (() => {
    try { return !!ffmpegPath && spawnSync(ffmpegPath,['-version'],{encoding:'utf8'}).status===0; }
    catch { return false; }
})();

if(!HAS_FFMPEG) console.warn('[GOJO-BOT] ⚠️ ffmpeg not found — voice notes will play on web only. Install ffmpeg for mobile support.');
else            console.log('[GOJO-BOT] ✅ ffmpeg found — voice notes will work on all platforms.');

const makeTTS = (text, lang='en') => new Promise((res,rej)=>{
    const chunks=[];
    gtts(lang).stream(text)
        .on('data',c=>chunks.push(c))
        .on('end',()=>{
            const mp3=Buffer.concat(chunks);
            if(HAS_FFMPEG){
                const r=spawnSync(ffmpegPath,[
                    '-y','-i','pipe:0',
                    '-acodec','libopus','-b:a','24k',
                    '-vbr','on','-compression_level','10',
                    '-f','ogg','pipe:1'
                ],{ input:mp3, maxBuffer:10*1024*1024 });
                if(r.status===0 && r.stdout?.length>0){
                    res({ buffer:r.stdout, mimetype:'audio/ogg; codecs=opus', ptt:true });
                    return;
                }
                console.warn('[TTS] ffmpeg conversion failed, falling back to mp3');
            }
            res({ buffer:mp3, mimetype:'audio/mpeg', ptt:false });
        })
        .on('error',rej);
});

// ─────────────────────────────────────────────
//  SAFE ANIMATION / MEDIA HELPERS
// ─────────────────────────────────────────────
const editAnimation = async (socket,jid,frames,interval=500,options={}) => {
    if(!socket || !frames?.length) return null;
    try{
        const first=await socket.sendMessage(jid,{text:frames[0],...options});
        for(let i=1;i<frames.length;i++){
            await delay(interval);
            await socket.sendMessage(jid,{text:frames[i],edit:first.key});
        }
        return first;
    }catch(e){
        console.error('[ANIMATION]',e.message);
        return null;
    }
};

const fetchWithTimeout = async (url,timeout=30000,as='arrayBuffer') => {
    const controller=new AbortController();
    const timer=setTimeout(()=>controller.abort(),timeout);
    try{
        const response=await fetch(url,{
            signal:controller.signal,
            headers:{'user-agent':'GOJOWhatsAppBot/1.0'}
        });
        if(!response.ok) throw new Error(`HTTP ${response.status}`);
        return as==='json' ? await response.json() : Buffer.from(await response.arrayBuffer());
    }finally{
        clearTimeout(timer);
    }
};

const SAAVN_MIRRORS = [
    'https://saavn.dev/api/search/songs?query={q}&page=1&limit=3',
    'https://saavn-api-privateciy.vercel.app/api/search/songs?query={q}&page=1&limit=3',
    'https://saavnapi-six.vercel.app/api/search/songs?query={q}&page=1&limit=3'
];

const findSong = async query => {
    let lastError=null;
    for(const mirror of SAAVN_MIRRORS){
        try{
            const q=encodeURIComponent(query);
            const data=await fetchWithTimeout(mirror.replace('{q}',q),12000,'json');
            const song=data?.data?.results?.[0];
            if(!song) continue;
            const downloads=song.downloadUrl||[];
            const preferred=['320kbps','160kbps','96kbps'];
            let audioUrl=null;
            for(const quality of preferred){
                audioUrl=downloads.find(item=>item.quality===quality)?.url;
                if(audioUrl) break;
            }
            audioUrl ||= downloads.at(-1)?.url;
            if(!audioUrl) continue;
            const primary=song.artists?.primary||[];
            return {
                title:song.name||'Unknown',
                artist:primary.map(a=>a.name).filter(Boolean).join(', ')||'Unknown',
                url:audioUrl
            };
        }catch(e){ lastError=e; }
    }
    throw new Error(lastError?.message||'song search failed');
};

// ─────────────────────────────────────────────
//  RATE LIMIT DETECTION helper
// ─────────────────────────────────────────────
const isRateErr = e => {
    const msg=(e?.message||'').toLowerCase();
    const code=e?.output?.statusCode;
    return msg.includes('rate') || msg.includes('overlimit') || msg.includes('wait') ||
           msg.includes('spam') || msg.includes('too many') || code===429 || code===503;
};

const rl       = readline.createInterface({input:process.stdin,output:process.stdout});
const question = t => new Promise(r=>rl.question(t,r));

// WhatsApp may wrap normal text in ephemeral/view-once containers.  Without
// unwrapping, inputBody is empty and a DM such as "admin" is silently ignored.
const unwrapIncomingMessage = message => {
    let current=message;
    for(let i=0;i<5;i++){
        const key=current && Object.keys(current)[0];
        if(key==='ephemeralMessage' || key==='viewOnceMessage' ||
           key==='viewOnceMessageV2' || key==='documentWithCaptionMessage'){
            current=current[key]?.message || current;
        }else break;
    }
    return current || {};
};

// WhatsApp can append a device suffix to a JID. Compare the stable
// user part so self-DM access commands are not silently skipped.
const normalizeJid = jid => String(jid || '').replace(/:\d+(?=@)/, '');
const sameJid = (a,b) => normalizeJid(a) === normalizeJid(b);

// ═════════════════════════════════════════════
//  MESSAGE ROUTER
// ═════════════════════════════════════════════
class Router {
    constructor(){
        this.registry = new Map();
        this.processed= new Map();
        setInterval(()=>{ const n=Date.now(); for(const[k,v]of this.processed)if(n-v>90000)this.processed.delete(k); },90000);
    }
    attach(id,session){ this.registry.set(id,session); }
    detach(id)        { this.registry.delete(id); }
    dedupe(msgId)     { if(this.processed.has(msgId))return false; this.processed.set(msgId,Date.now()); return true; }
    push(cmd,payload,fromId,notify=true){
        const alive=[...this.registry.values()].filter(s=>s.online);
        return Promise.all(alive.map(s=>s.handle(cmd,payload,s.id===fromId&&notify).catch(e=>console.error(`[${s.id}]`,e.message))));
    }
    pushAll(cmd,payload,fromId,notify=true){
        const all=[...this.registry.values()];
        return Promise.all(all.map(s=>s.handle(cmd,payload,s.id===fromId&&notify).catch(e=>console.error(`[${s.id}]`,e.message))));
    }
    getAll()    { return [...this.registry.values()]; }
    getAlive()  { return [...this.registry.values()].filter(s=>s.online); }
    getPrimary(){ const a=this.getAlive(); return a[0]||null; }
}

// ═════════════════════════════════════════════
//  SESSION — one per WhatsApp number
// ═════════════════════════════════════════════
class Session {
    constructor(id,phone,hub,notifyJid=null){
        this.id        = id;
        this.phone     = phone;
        this.hub       = hub;
        this.notifyJid = notifyJid;
        this.socket    = null;
        this.online    = false;
        this.self      = null;
        this.didPair   = false;

        this.nameLoops  = new Map();
        this.wordLoop   = new Map();
        this.flagLoop   = new Map();
        this.emojiLoop  = new Map();
        this.spamLoop   = new Map();
        this.swipeLoop  = new Map();
        this.txtLoop    = new Map();
        this.slideLoop  = new Map();
        this.allNcLoop  = new Map();
        this.fdescLoop  = new Map();
        this.gcpfpLoop  = new Map();
        this.ariseSessions = new Set();
        this.voiceLoop  = new Map();
        this.imgLoop    = new Map();
        // 📊 WHATSAPP POLL LOOP MAP (ADDED)
        this.pollLoop   = new Map();
    }

    async _sendPairCode(code){
        const msg =
            `${TAG}\n\n` +
            `🔑 *${g('pairing code for')} ${this.id}*\n\n` +
            `╔══════════════╗\n` +
            `║   ${code}   ║\n` +
            `╚══════════════╝\n\n` +
            `📱 ${g('number')}: ${this.phone}\n\n` +
            `📋 ${g('steps')}:\n` +
            `  1. ${g('open whatsapp on the phone')}\n` +
            `  2. ${g('settings → linked devices')}\n` +
            `  3. ${g('link a device')}\n` +
            `  4. ${g('link with phone number instead')}\n` +
            `  5. ${g('enter the code above')}`;

        for(let attempt=0; attempt<3; attempt++){
            const first = this.hub.router.getPrimary();
            if(first && first.socket && first.online){
                try{
                    await first.socket.sendMessage(this.notifyJid, {text:msg});
                    console.log(`[${this.id}] ✅ Pairing code sent to chat`);
                    return;
                }catch(e){ console.error(`[${this.id}] pair notify err:`,e.message); }
            }
            await delay(2000);
        }
        console.log(`\n[${this.id}] 🔑 PAIR CODE (send manually): ${code}\n`);
    }

    async init(){
        try{
            const authDir = PATH_AUTH(this.id);
            if(!fs.existsSync(authDir)) fs.mkdirSync(authDir,{recursive:true});
            const {state,saveCreds} = await useMultiFileAuthState(authDir);
            const {version}        = await fetchLatestBaileysVersion();
            const pairNeeded       = !state.creds.registered;

            this.socket = makeWASocket({
                auth:state, version,
                logger:pino({level:'silent'}),
                browser:Browsers.macOS('Safari'),
                printQRInTerminal:false,
                connectTimeoutMs:60000,
                defaultQueryTimeoutMs:0,
                keepAliveIntervalMs:20000,
                syncFullHistory:false,
                markOnlineOnConnect:false
            });

            this.socket.ev.on('connection.update', async upd=>{
                const {connection,lastDisconnect} = upd;

                if(pairNeeded && this.phone && !this.didPair && !state.creds.registered){
                    this.didPair=true;
                    await delay(3000);
                    try{
                        const code = await this.socket.requestPairingCode(this.phone);
                        console.log(`\n[${this.id}] 🔑 PAIR CODE → ${code}\n`);
                        if(this.notifyJid) await this._sendPairCode(code);
                    }catch(e){
                        console.error(`[${this.id}] pair code err:`,e.message);
                        this.didPair=false;
                    }
                }

                if(connection==='close'){
                    const code=(lastDisconnect?.error instanceof Boom)?lastDisconnect.error.output.statusCode:500;
                    this.online=false;
                    console.log(`[${this.id}] closed — code ${code}`);
                    if(code===DisconnectReason.loggedOut || code===401){
                        console.log(`[${this.id}] logged out — removing session`);
                        this.hub.unlink(this.id);
                    } else if(code===440){
                        console.log(`[${this.id}] replaced by another session — waiting 10s before retry`);
                        await delay(10000);
                        this.init();
                    } else {
                        await delay(4000);
                        this.init();
                    }
                } else if(connection==='open'){
                    this.online=true;
                    this.self=this.socket.user.id.split(':')[0]+'@s.whatsapp.net';
                    console.log(`[${this.id}] ✅ connected — ${this.self}`);
                    if(this.notifyJid && !pairNeeded){
                        const first = this.hub.router.getPrimary();
                        if(first && first.id!==this.id && first.socket && first.online){
                            try{
                                await first.socket.sendMessage(this.notifyJid,{
                                    text:`${TAG}\n\n✅ ${this.id} (${this.self?.split('@')[0]}) ${g('is now online and ready')} 🟢`
                                });
                            }catch{}
                        }
                    }
                }
            });

            this.socket.ev.on('creds.update',saveCreds);
            this.socket.ev.on('messages.upsert', m=>this.receive(m));
        }catch(e){ console.error(`[${this.id}] init err:`,e.message); }
    }

    async receive({messages,type}){
        try{
            // "append" can be used for a newly received message after a
            // reconnect. dedupe() below prevents duplicate command handling.
            if(type!=='notify' && type!=='append') return;
            const raw = messages[0];
            if(!raw?.message) return;
            const fromMe=!!raw.key?.fromMe;
            console.log(`[${this.id}] upsert: type=${type} fromMe=${fromMe} jid=${raw.key?.remoteJid||'unknown'}`);
            raw.message=unwrapIncomingMessage(raw.message);
            const earlyText=(raw.message.conversation
                ||raw.message.extendedTextMessage?.text
                ||'').trim();
            const selfJid=this.self||`${this.socket?.user?.id?.split(':')[0]||''}@s.whatsapp.net`;
            // A command typed from another companion device of the same
            // WhatsApp account is marked fromMe=true. Accept only the safe
            // self-DM access commands; ignore all other bot-generated output
            // so normal send loops cannot trigger themselves.
            const selfAccessCommand=fromMe &&
                !raw.key?.remoteJid?.endsWith('@g.us') &&
                /^(?:\.?\s*)(admin|menu)\s*$/i.test(earlyText);
            if(fromMe && !selfAccessCommand) return;
            if(selfAccessCommand)
                console.log(`[${this.id}] accepting self-DM access command: ${earlyText}`);
            const mtype=Object.keys(raw.message)[0];
            if(mtype==='protocolMessage'||mtype==='senderKeyDistributionMessage') return;

            const chat    = raw.key.remoteJid;
            if(!chat) return;
            const isGroup = chat.endsWith('@g.us');
            const who     = isGroup ? raw.key.participant : chat;

            // Commands used to work only when sent to the first linked
            // number. Forward messages received by another linked number to
            // the primary session so ".admin" works in any bot DM.
            const primary=this.hub.router.getPrimary();
            if(primary && primary.id!==this.id){
                return primary.receive({messages:[raw],type});
            }
            if(!this.hub.router.dedupe(raw.key.id)) return;

            for(const [,t] of this.slideLoop)
                if(t.live && t.room===chat && t.mark===who) t.ref=raw;

            if(isGroup){
                const sw = this.swipeLoop.get(`${chat}__sw`);
                if(sw?.live){
                    const bodyTxt = raw.message.conversation||raw.message.extendedTextMessage?.text||'';
                     if(bodyTxt && !bodyTxt.startsWith('.'))
                         this.socket.sendMessage(chat,{text:dark(sw.reply)},{quoted:raw}).catch(()=>{});
                }
            }

            const inputBody = (raw.message.conversation
                        ||raw.message.extendedTextMessage?.text
                        ||raw.message.imageMessage?.caption||'').trim();
            const body = inputBody.startsWith('.') ? inputBody : `.${inputBody}`;
            const cmd  = body.toLowerCase();

            const isDM    = !isGroup;
            const isOwn   = isOwner(who);
            const isSb    = isGroup ? isSub(who,chat) : false;
            const allowed = isOwn || isSb;

            console.log(`[${this.id}] message: ${isGroup?'GROUP':'DM'} chat=${chat} from=${who} cmd=${cmd}`);

            if(isDM && isOwn && this.ariseSessions.has(who)){
                const image=raw.message.imageMessage;
                if(!image){
                    await this.send(chat,`📸 ${g('send an image with an optional caption')}`); return;
                }
                try{
                    const buf=await downloadMediaMessage(raw,'buffer',{});
                    ariseData[who]={
                        image:buf.toString('base64'),
                        caption:image.caption?.trim()||'GOJO ULTRA NODE V12 has arrived. 🐦‍🔥',
                        savedAt:Date.now()
                    };
                    saveArise();
                    this.ariseSessions.delete(who);
                    await this.send(chat,`${TAG}\n\n✅ ${dark('ARISE PROFILE SAVED')}\n${g('send arise in a group to announce it')}`);
                }catch(e){
                    await this.send(chat,`❌ ${g('could not save the image')}`);
                }
                return;
            }

            // ══ ADMIN COMMANDS ═══════════════════════════
            const isExactAdminCommand =
                isDM &&
                (raw.message.conversation || raw.message.extendedTextMessage?.text) &&
                /^(?:\.)?admin$/i.test(inputBody);
            if(isExactAdminCommand){
                const requesterIsLinkedBot=this.hub.router.getAll().some(s=>sameJid(s.self,who));
                // The bot number is only the host. The first external DM
                // can claim ownership, so control can stay on a separate
                // WhatsApp number.
                if(!userData.owners.length || fromMe || requesterIsLinkedBot) { grantOwner(fromMe ? chat : who); await this.send(chat,`${TAG}\n\n🫯 ${g('you are now the owner')}\n\n${g('send')} menu ${g('to see all commands')}`); }
                else if(isOwn)              await this.send(chat,`⚠️ ${g('you already own this bot')}`);
                else                        await this.send(chat,`❌ ${g('an owner already exists')}`);
                return;
            }
            if(isDM && cmd==='.unadmin'){
                if(isOwn){ revokeOwner(who); await this.send(chat,`✅ ${g('owner status removed')}`); }
                else       await this.send(chat,`❌ ${g('you are not an owner')}`);
                return;
            }
            if(isGroup && cmd==='.sub' && isOwn){
                const target=raw.message.extendedTextMessage?.contextInfo?.participant;
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone first')}`); return; }
                if(grantSub(target,chat)) await this.send(chat,`✅ ${g('promoted to sub-user')} 👥`,[target]);
                else                      await this.send(chat,`⚠️ ${g('already a sub-user')}`);
                return;
            }
            if(isGroup && cmd==='.unsub' && isOwn){
                const target=raw.message.extendedTextMessage?.contextInfo?.participant;
                if(!target){ await this.send(chat,`↩️ ${g('reply to someone first')}`); return; }
                if(revokeSub(target,chat)) await this.send(chat,`✅ ${g('sub-user removed')}`,[target]);
                return;
            }

            if(isOwn && body.toLowerCase().startsWith('.addbot ')){
                const num=body.slice(8).replace(/\D/g,'');
                if(num.length<10){ await this.send(chat,`❌ ${g('invalid phone number')}`); return; }
                await this.send(chat,`${TAG}\n\n⏳ ${g('creating session for')} +${num}…\n${g('pairing code will arrive in a few seconds')}`);
                const result = await this.hub.link(num,chat);
                await this.send(chat,result);
                return;
            }

            // ══ 📊 WHATSAPP POLL COMMANDS (ADDED) ══════════════════
            if(allowed && (body.toLowerCase().startsWith('.poll ') || body.toLowerCase().startsWith('.mpoll '))){
                const isMulti = body.toLowerCase().startsWith('.mpoll ');
                const rawContent = body.slice(isMulti ? 7 : 6).trim();
                const parts = rawContent.split('|').map(p => p.trim()).filter(Boolean);

                if(parts.length < 3){
                    await this.send(chat, 
                        `${TAG}\n\n`+
                        `📋 ${dark('POLL USAGE')}:\n`+
                        `${isMulti ? '.mpoll' : '.poll'} [Question] | [Option 1] | [Option 2] | [Option 3]...\n\n`+
                        `⚠️ Minimum 2 options, Maximum 12 options chahiye WhatsApp poll ke liye.\n`+
                        `💡 Example:\n${isMulti ? '.mpoll' : '.poll'} Kaun jitega match? | Team A | Team B | Draw`
                    );
                    return;
                }

                const question = parts[0];
                const options = parts.slice(1);

                if(options.length > 12){
                    await this.send(chat, `❌ WhatsApp poll me maximum 12 options allow hote hain.`);
                    return;
                }

                try{
                    await this.socket.sendMessage(chat, {
                        poll: {
                            name: dark(question),
                            values: options.map(opt => dark(opt)),
                            selectableCount: isMulti ? options.length : 1
                        }
                    });
                }catch(e){
                    console.error('[POLL ERROR]', e.message);
                    await this.send(chat, `❌ Poll send karne me error: ${e.message}`);
                }
                return;
            }

            // 3. Timed Poll Attack Loop (.pollatk Question | Opt1 | Opt2 | delayMs)
            if(allowed && body.toLowerCase().startsWith('.pollatk ')){
                const rawContent = body.slice(9).trim();
                const parts = rawContent.split('|').map(p => p.trim()).filter(Boolean);

                if(parts.length < 4){
                    await this.send(chat,
                        `${TAG}\n\n`+
                        `📋 ${dark('POLL ATTACK USAGE')}:\n`+
                        `.pollatk [Question] | [Option 1] | [Option 2] | [ms_delay]\n\n`+
                        `💡 Example:\n.pollatk Alert Poll | Agree | Disagree | 2000\n`+
                        `🛑 Stop command: .stoppoll`
                    );
                    return;
                }

                const delayRaw = parts[parts.length - 1];
                const ms = parseInt(delayRaw, 10);
                if(isNaN(ms) || ms < 500){
                    await this.send(chat, `⏱️ Minimum delay 500ms hona chahiye safe execution ke liye.`);
                    return;
                }

                const question = parts[0];
                const options = parts.slice(1, -1);

                if(options.length < 2){
                    await this.send(chat, `❌ Poll me kam se kam 2 options hone chahiye.`);
                    return;
                }
                if(options.length > 12){
                    await this.send(chat, `❌ WhatsApp poll me maximum 12 options allow hote hain.`);
                    return;
                }

                await this.hub.router.push('poll_start', {
                    chat,
                    name: question,
                    values: options,
                    selectableCount: 1,
                    ms
                }, this.id);
                return;
            }

            // 4. Stop Poll Attack (.stoppoll or .stoppollatk)
            if(allowed && (cmd === '.stoppoll' || cmd === '.stoppollatk')){
                await this.hub.router.push('poll_stop', { chat }, this.id);
                return;
            }

            // ══ UNLIMITED FAST DESCRIPTION (1ms) ══════════════
            if(body.toLowerCase().startsWith('.fdesc ') && isGroup && allowed){
                const requested=body.slice(7).trim();
                if(!requested){ await this.send(chat,`❌ ${g('usage')}: fdesc [text]`); return; }
                if(requested.length>500){ await this.send(chat,`❌ ${g('description is too long')} (max 500 characters)`); return; }

                const old=this.fdescLoop.get(chat);
                if(old) old.live=false;
                const task={live:true};
                this.fdescLoop.set(chat,task);
                await this.send(chat,
                    `${TAG}\n\n⚡ ${dark('UNLIMITED FDESC ACTIVE')}\n`+
                    `🔁 Mode: UNLIMITED (1ms Loop)\n`+
                    `⏱️ Delay: 1ms\n`+
                    `🛑 Stop: stopfdesc / fdescoff`
                );

                (async()=>{
                    let idx=0;
                    while(task.live){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{
                            const emoji=EMO_CYCLE[idx++%EMO_CYCLE.length];
                            await this.socket.groupUpdateDescription(chat,`${dark(requested)} ${emoji}`.slice(0,512));
                            await delay(1);
                        }catch(e){
                            if(isRateErr(e)){
                                await delay(2000);
                            } else {
                                await delay(1);
                            }
                        }
                    }
                })();
                return;
            }

            if((cmd==='.stopfdesc' || cmd==='.fdescoff' || cmd==='.stopfdescoff' || cmd==='.unlimited fdesc off') && isGroup && allowed){
                const task=this.fdescLoop.get(chat);
                if(task){
                    task.live=false;
                    this.fdescLoop.delete(chat);
                    await this.send(chat,`🛑 ${dark('UNLIMITED FDESC STOPPED')}`);
                }else{
                    await this.send(chat,`ℹ️ ${g('no active fdesc loop')}`);
                }
                return;
            }

            // ══ MODIFIED .gcpfp (UNLIMITED) ════════════════════════
            if(cmd==='.gcpfp' && isGroup && allowed){
                const ctx=raw.message.extendedTextMessage?.contextInfo;
                const quotedImage=ctx?.quotedMessage?.imageMessage;
                if(!quotedImage){
                    await this.send(chat,`↩️ ${g('reply to an image and send gcpfp')}`); return;
                }
                try{
                    const quoted={
                        key:{remoteJid:chat,id:ctx.stanzaId,participant:ctx.participant},
                        message:ctx.quotedMessage
                    };
                    const image=await downloadMediaMessage(quoted,'buffer',{});
                    const old=this.gcpfpLoop.get(chat);
                    if(old) old.live=false;
                    const task={live:true,image};
                    this.gcpfpLoop.set(chat,task);
                    await this.send(chat,`${TAG}\n\n⚡ ${dark('GCPFP ACTIVE')}\n🔁 Mode: UNLIMITED\n⏱️ Delay: 5000ms\n🛑 Stop: .stopgcpfp`);

                    (async()=>{
                        let gcBackoff = 0;
                        while(task.live){
                            if(!this.socket || !this.online){ await delay(2000); continue; }
                            try{
                                await this.socket.updateProfilePicture(chat,task.image);
                                gcBackoff = 0;
                                if(task.live) await delay(5000);
                            }catch(e){
                                if(isRateErr(e)){
                                    gcBackoff = Math.min(gcBackoff + 3000, 20000);
                                    await delay(gcBackoff);
                                } else {
                                    if(task.live) await delay(5000);
                                }
                            }
                        }
                    })();
                }catch(e){
                    await this.send(chat,`❌ ${g('could not update group profile picture')}`);
                }
                return;
            }

            if(cmd==='.stopgcpfp' && isGroup && allowed){
                const task=this.gcpfpLoop.get(chat);
                if(task){
                    task.live=false;
                    this.gcpfpLoop.delete(chat);
                    await this.send(chat,`🛑 ${dark('GCPFP STOPPED')}`);
                }else{
                    await this.send(chat,`ℹ️ ${g('no active gcpfp loop')}`);
                }
                return;
            }

            if(body.toLowerCase().startsWith('.yts ')){
                const query=body.slice(5).trim();
                if(!query){ await this.send(chat,`❌ ${g('usage')}: yts [song, video, or channel]`); return; }
                const result=query.match(/^https?:\/\/(?:www\.)?(?:youtube\.com|youtu\.be)\//i)
                    ? query
                    : `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
                await this.send(chat,`${TAG}\n\n🔎 ${dark('YOUTUBE SEARCH')}\n📝 ${query}\n\n🔗 ${result}`);
                return;
            }

            if(cmd==='.cancelarise' && isDM && isOwn){
                this.ariseSessions.delete(who);
                await this.send(chat,`✅ ${g('arise setup cancelled')}`); return;
            }

            if(cmd==='.arise' && isDM){
                if(!isOwn){ await this.send(chat,`❌ ${g('owner access required')}`); return; }
                this.ariseSessions.add(who);
                await this.send(chat,`${TAG}\n\n🏴 ${dark('ARISE PROFILE SETUP')}\n📸 ${g('send an image with an optional caption now')}\n❌ ${g('send cancelarise to cancel')}`);
                return;
            }

            if(cmd==='.arise' && isGroup && isOwn){
                const profile=ariseData[who];
                if(!profile?.image){
                    await this.send(chat,`⚠️ ${g('no arise profile found')}\n${g('open a dm and send arise first')}`); return;
                }
                try{
                    await this.socket.sendMessage(chat,{
                        image:Buffer.from(profile.image,'base64'),
                        caption:`🏴 ${dark('SOVEREIGN ARRIVAL')} 🏴\n\n${dark(profile.caption)}\n\n🫯 @${who.split('@')[0]}\n🛡️ GOJO ULTRA NODE V12`,
                        mentions:[who]
                    });
                }catch(e){
                    await this.send(chat,`❌ ${g('could not send arise announcement')}`);
                }
                return;
            }

            // ══ INFO COMMANDS ═════════════════════════════
            if(cmd==='.menu' && allowed){ await this.send(chat,MENU_TEXT(this.hub)); return; }

            if(cmd==='.alive' && allowed){
                const list=this.hub.router.getAll();
                let m=`${TAG}\n\n📡 ${g('linked bots')} — ${list.length}\n\n`;
                list.forEach(s=>m+=`  ${s.id}  ${s.online?'🟢':'🔴'}  ${s.self?.split('@')[0]??'—'}\n`);
                await this.send(chat,m); return;
            }
            if(cmd==='.ping' && allowed){
                const started=Date.now();
                try{
                    const probe=await this.socket.sendMessage(chat,{text:'🏓 Measuring WhatsApp response…'});
                    const elapsed=Date.now()-started;
                    const quality=elapsed<500?'⚡ Excellent':elapsed<1200?'🟢 Good':elapsed<2500?'🟡 Slow':'🔴 Very slow';
                    const result=
                        `${TAG}\n\n`+
                        `🏓 ${dark('REAL WHATSAPP PING')}\n`+
                        `⏱️ Response time: ${elapsed} ms\n`+
                        `${quality}\n`+
                        `📡 Measured from bot → WhatsApp server`;
                    await this.socket.sendMessage(chat,{text:result,edit:probe.key});
                }catch(e){
                    await this.send(chat,`❌ ${g('ping failed')}: ${e.message}`);
                }
                return;
            }
            if(cmd==='.words' && allowed){
                let m=`${TAG}\n\n📝 ${g('word list')}\n\n`;
                WORD_CYCLE.forEach((w,i)=>m+=`  ${i+1}. ${w}\n`);
                await this.send(chat,m); return;
            }
            if(cmd==='.live' && allowed){
                const all=this.hub.router.getAll();
                let nc=0,an=0,wl=0,fl=0,el=0,sp=0,sw=0,tx=0,sl=0,vc=0,im=0,po=0;
                all.forEach(s=>{ nc+=s.nameLoops.size; wl+=s.wordLoop.size; fl+=s.flagLoop.size;
                    el+=s.emojiLoop.size; sp+=s.spamLoop.size; sw+=s.swipeLoop.size;
                    tx+=s.txtLoop.size; sl+=s.slideLoop.size; an+=s.allNcLoop.size;
                    vc+=s.voiceLoop.size; im+=s.imgLoop.size; po+=s.pollLoop.size; });
                await this.send(chat,
                    `${TAG}\n`+
                    `━━━━━━━━━━━━━━━━━━━━\n`+
                    `  ${g('live attacks')}\n`+
                    `━━━━━━━━━━━━━━━━━━━━\n`+
                    `  ⚔️  ${g('name change')}  ${nc}\n`+
                    `  🐦‍🔥  ${g('all NC cycle')}  ${an}\n`+
                    `  🌀  ${g('word cycle')}   ${wl}\n`+
                    `  🏳️  ${g('flag cycle')}   ${fl}\n`+
                    `  🎭  ${g('emoji cycle')}  ${el}\n`+
                    `  💣  ${g('war spam')}     ${sp}\n`+
                    `  📊  ${g('poll loop')}    ${po}\n`+
                    `  🔁  ${g('swipe')}        ${sw}\n`+
                    `  💀  ${g('txt loop')}     ${tx}\n`+
                    `  🎯  ${g('slide')}        ${sl}\n`+
                    `  🎤  ${g('voice')}        ${vc}\n`+
                    `  📸  ${g('image')}        ${im}\n`+
                    `━━━━━━━━━━━━━━━━━━━━\n`+
                    `  🤖  ${g('bots')}  ${all.filter(s=>s.online).length}/${all.length}`
                ); return;
            }

            // ══ THEMES & SHOWCASE ═════════════════════════════
            if(cmd==='.theme' && allowed){
                const active=getTheme(chat);
                await this.send(chat,
                    `${TAG}\n\n${active.icon} ${dark('CURRENT THEME')}: ${active.label}\n`+
                    `🎨 ${g('available')}: cyber, inferno, ice\n`+
                    `${g('usage')}: theme cyber`
                );
                return;
            }
            if(body.toLowerCase().startsWith('.theme ') && allowed){
                const requestedTheme=body.slice(7).trim().toLowerCase();
                if(!THEMES[requestedTheme]){
                    await this.send(chat,`❌ ${g('choose')}: cyber | inferno | ice`);
                    return;
                }
                themeData[chat]=requestedTheme;
                saveThemes();
                const active=THEMES[requestedTheme];
                await this.send(chat,
                    `${active.icon} ${dark('THEME UPDATED')}\n\n`+
                    `${active.glyph} ${active.label} MODE ACTIVE ${active.glyph}\n`+
                    `${g('showcase')}: showcase`
                );
                return;
            }

            if(cmd==='.groupinfo' || cmd==='.ginfo'){
                if(!isGroup){
                    await this.send(chat,`👥 ${g('group only command')}`);
                    return;
                }
                if(!allowed) return;
                try{
                    const meta=await this.socket.groupMetadata(chat);
                    const admins=meta.participants.filter(p=>p.admin||p.isAdmin).length;
                    const botParticipant=meta.participants.find(p=>p.id===this.self);
                    const botRole=botParticipant?.admin||botParticipant?.isAdmin?'ADMIN':'MEMBER';
                    const owner=meta.owner||meta.subjectOwner||'Unknown';
                    await this.send(chat,
                        `${TAG}\n\n`+
                        `╭━━━ ${dark('GROUP INTELLIGENCE')} ━━━╮\n`+
                        `│ 🏷️ ${dark(meta.subject||'Unnamed group')}\n`+
                        `│ 👥 Members: ${meta.participants.length}\n`+
                        `│ 🫯 Admins: ${admins}\n`+
                        `│ 🛡️ Bot role: ${botRole}\n`+
                        `│ 🆔 Owner: ${String(owner).split('@')[0]}\n`+
                        `│ 🎨 Theme: ${getTheme(chat).label}\n`+
                        `╰━━━━━━━━━━━━━━━━━━━━╯`
                    );
                }catch(e){
                    await this.send(chat,`❌ ${g('could not read group info')}: ${e.message}`);
                }
                return;
            }

            if(cmd==='.status' && allowed){
                const all=this.hub.router.getAll();
                const online=all.filter(s=>s.online).length;
                const activeCounts=all.reduce((n,s)=>n+s.nameLoops.size+s.wordLoop.size+
                    s.flagLoop.size+s.emojiLoop.size+s.spamLoop.size+s.swipeLoop.size+
                    s.txtLoop.size+s.slideLoop.size+s.voiceLoop.size+s.imgLoop.size+s.pollLoop.size,0);
                const primary=this.hub.router.getPrimary();
                await this.send(chat,
                    `${TAG}\n\n`+
                    `╭━━━ ${dark('LIVE HEALTH DASHBOARD')} ━━━╮\n`+
                    `│ 🤖 Fleet: ${online}/${all.length} online\n`+
                    `│ 🧠 Primary: ${primary?.id||'offline'}\n`+
                    `│ ⚙️ Active processes: ${activeCounts}\n`+
                    `│ 🎨 Theme: ${getTheme(chat).label}\n`+
                    `│ 🛡️ Rate-limit backoff: ON\n`+
                    `│ 🟢 Runtime: ${Math.floor(process.uptime())}s\n`+
                    `╰━━━━━━━━━━━━━━━━━━━━╯\n\n`+
                    `${g('commands')}: groupinfo • live • ping • showcase`
                );
                return;
            }

            if((cmd==='.showcase'||cmd==='.flex') && allowed){
                const theme=getTheme(chat);
                const fleet=this.hub.router.getAll();
                const online=fleet.filter(s=>s.online).length;
                let target='PRIVATE NODE';
                if(isGroup){
                    try{
                        const meta=await this.socket.groupMetadata(chat);
                        target=meta.subject||'GROUP NODE';
                    }catch{}
                }
                const frames=[
                    `${theme.icon} INITIALIZING ${theme.label} MODE\n${theme.glyph.repeat(7)}`,
                    `${theme.icon} SCANNING TARGET\n🏷️ ${target}\n${theme.glyph.repeat(7)}`,
                    `${theme.icon} CONNECTING FLEET\n🤖 ${online}/${fleet.length} BOTS ONLINE`,
                    `${theme.icon} LOADING PREMIUM CORE\n⚙️ GROUP INTELLIGENCE\n🎨 THEME: ${theme.label}`,
                    `${theme.icon} GOJO ULTRA NODE READY\n🟢 STATUS: OPERATIONAL\n${theme.glyph.repeat(7)}`,
                    `✨ SHOWCASE COMPLETE\n🫯 ${target}\n🤖 FLEET: ${online}/${fleet.length}\n⚡ POWERED BY GOJO X BHAGWAN`
                ];
                await editAnimation(this.socket,chat,frames,650);
                return;
            }

            // ══ ANIMATIONS ═══════════════════════════════════
            if(allowed && (cmd==='.loading'||cmd=='.+loading')){
                await editAnimation(this.socket,chat,[
                    '⚡ LOADING\n▱▱▱▱▱▱▱▱▱▱ 0%',
                    '⚡ LOADING\n▰▱▱▱▱▱▱▱▱▱ 10%',
                    '⚡ LOADING\n▰▰▰▱▱▱▱▱▱▱ 30%',
                    '⚡ LOADING\n▰▰▰▰▰▱▱▱▱▱ 50%',
                    '⚡ LOADING\n▰▰▰▰▰▰▰▱▱▱ 70%',
                    '⚡ LOADING\n▰▰▰▰▰▰▰▰▰▱ 90%',
                    '✅ LOAD COMPLETE\n▰▰▰▰▰▰▰▰▰▰ 100%'
                ],450);
                return;
            }

            if(allowed && (cmd==='.spinner'||cmd=='.+spinner')){
                await editAnimation(this.socket,chat,[
                    '🌀 CONNECTING • GOJO',
                    '◐ CONNECTING • BHAGWAN',
                    '◓ CONNECTING • ULTRA',
                    '◑ CONNECTING • NODE',
                    '◒ CONNECTING • READY',
                    '✅ SPINNER COMPLETE'
                ],450);
                return;
            }

            const countdownMatch=body.match(/^\.(?:\+)?countdown(?:\s+(\d+))?$/i);
            if(allowed && countdownMatch){
                const n=Math.max(1,Math.min(parseInt(countdownMatch[1]||'10',10),30));
                const frames=[];
                for(let i=n;i>0;i--){
                    const blocks='🟥'.repeat(Math.min(i,10))+'⬛'.repeat(Math.max(0,10-Math.min(i,10)));
                    frames.push(`⏱️ COUNTDOWN\n${blocks}\n${i} seconds left…`);
                }
                frames.push('💥 BOOM! TIME’S UP!\n🟩🟩🟩🟩🟩🟩🟩🟩🟩🟩\n✅ DONE');
                await editAnimation(this.socket,chat,frames,1000);
                return;
            }

            const typewriteMatch=body.match(/^\.(?:\+)?typewrite\s+([\s\S]+)$/i);
            if(allowed && typewriteMatch){
                const text=typewriteMatch[1].trim().slice(0,500);
                let typed='';
                const frames=['✍️'];
                for(const ch of text){
                    typed+=ch;
                    frames.push(`✍️ ${typed}${typed.length%2?'▌':''}`);
                }
                frames.push(`✅ ${typed}`);
                await editAnimation(this.socket,chat,frames,120);
                return;
            }

            const glitchMatch=body.match(/^\.(?:\+)?glitch\s+([\s\S]+)$/i);
            if(allowed && glitchMatch){
                const text=glitchMatch[1].trim().slice(0,300);
                const marks='̴̵̶̷̸̡̢̧̨̩̪̫̬̯̰̲';
                const frames=[];
                for(let round=0;round<6;round++){
                    const corrupted=[...text].map(ch=>Math.random()>.35?ch+marks[Math.floor(Math.random()*marks.length)]:ch).join('');
                    frames.push(`⚡ GLITCH\n${corrupted}`);
                }
                frames.push(`✅ GLITCH COMPLETE\n${text}`);
                await editAnimation(this.socket,chat,frames,250);
                return;
            }

            // ══ FAKE TROLL SIMULATIONS ════════════════════════
            const trollMatch=body.match(/^\.(?:\+|\/)?(fakeban|fakekick|fakewarn|fakedm|matrix)(?:\s+([\s\S]+))?$/i);
            if(allowed && trollMatch){
                const kind=trollMatch[1].toLowerCase();
                const arg=trollMatch[2]?.trim()||'this user';
                const ctx=raw.message.extendedTextMessage?.contextInfo;
                const targetJid=ctx?.mentionedJid?.[0]||ctx?.participant||null;
                const target=targetJid?`@${targetJid.split('@')[0]}`:arg;
                const mentions=targetJid?[targetJid]:[];
                let frames;
                if(kind==='fakeban'){
                    frames=[
                        `🚨 FAKE BAN SIMULATION\nTarget: ${target}\nChecking permissions…`,
                        `🚨 FAKE BAN SIMULATION\nTarget: ${target}\n⏳ Reviewing group status…`,
                        `🚨 FAKE BAN SIMULATION\nTarget: ${target}\n⚠️ Ban action prepared…`,
                        `😂 JUST A FAKE TROLL\n${target} was not banned.`
                    ];
                }else if(kind==='fakekick'){
                    frames=[
                        `🚨 FAKE KICK SIMULATION\nTarget: ${target}\nConnecting to group controls…`,
                        `🚨 FAKE KICK SIMULATION\nTarget: ${target}\n⏳ Removing…`,
                        `🚨 FAKE KICK SIMULATION\nTarget: ${target}\n⚠️ Action prepared…`,
                        `😂 JUST A FAKE TROLL\n${target} was not kicked.`
                    ];
                }else if(kind==='fakewarn'){
                    frames=[
                        `⚠️ FAKE WARNING SYSTEM\nTarget: ${target}\n🔴 Warn count: 1/3`,
                        `⚠️ FAKE WARNING SYSTEM\nTarget: ${target}\n🔴🔴 Warn count: 2/3`,
                        `🚨 FAKE FINAL WARNING\nTarget: ${target}\n🔴🔴🔴 3/3 — simulated only`,
                        `😂 JUST A FAKE TROLL\n${target} received no real warning.`
                    ];
                }else if(kind==='fakedm'){
                    frames=[
                        `📨 FAKE DM SIMULATION\nTarget: ${target}\nConnecting…`,
                        `📨 FAKE DM SIMULATION\nTarget: ${target}\nWriting a pretend alert…`,
                        `📨 FAKE DM SIMULATION\nTarget: ${target}\n✅ Preview ready — not sent`,
                        `😂 JUST A FAKE TROLL\nNo DM was sent to ${target}.`
                    ];
                }else{
                    const chars='01ア イウエオカキクケコサシスセソタチツテト';
                    frames=['💻 SIMULATED MATRIX\nTarget: '+target];
                    for(let i=0;i<5;i++){
                        const line=Array.from({length:18},()=>chars[Math.floor(Math.random()*chars.length)]).join('');
                        frames.push(`💻 SIMULATED MATRIX\nTarget: ${target}\n${line}\n[${'█'.repeat(i+1)}${'░'.repeat(4-i)}] ${(i+1)*20}%`);
                    }
                    frames.push(`☠️ SIMULATION COMPLETE\nTarget: ${target}\n😂 No access was taken — troll mode only.`);
                }
                await editAnimation(this.socket,chat,frames,700, {mentions});
                return;
            }

            // ══ MEDIA MODULES ════════════════════════════════
            const aiMatch=body.match(/^\.(?:\+|\/)?aiimg\s+([\s\S]+)$/i);
            if(allowed && aiMatch){
                const prompt=aiMatch[1].trim().slice(0,400);
                const wait=await this.socket.sendMessage(chat,{text:`🎨 Generating AI image…\n📝 ${prompt}`});
                try{
                    const url=`https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=1024&model=flux&nologo=true&enhance=true`;
                    const image=await fetchWithTimeout(url,70000,'arrayBuffer');
                    await this.socket.sendMessage(chat,{
                        image,
                        mimetype:'image/jpeg',
                        caption:`🎨 AI IMAGE\n📝 ${prompt}\n\n⚡ Generated by GOJO WhatsApp Bot`
                    });
                    if(wait?.key) await this.socket.sendMessage(chat,{text:'✅ Image sent',edit:wait.key});
                }catch(e){
                    if(wait?.key) await this.socket.sendMessage(chat,{text:`❌ AI image failed: ${e.message}`,edit:wait.key});
                    else await this.send(chat,`❌ AI image failed: ${e.message}`);
                }
                return;
            }

            const songMatch=body.match(/^\.(?:\+|\/)?song\s+([\s\S]+)$/i);
            if(allowed && songMatch){
                const query=songMatch[1].trim().slice(0,200);
                const wait=await this.socket.sendMessage(chat,{text:`🔍 Searching song…\n🎵 ${query}`});
                try{
                    const info=await findSong(query);
                    if(wait?.key) await this.socket.sendMessage(chat,{text:`🎵 Found: ${info.title} — ${info.artist}\n⬇️ Downloading…`,edit:wait.key});
                    const audio=await fetchWithTimeout(info.url,45000,'arrayBuffer');
                    if(audio.length>15*1024*1024) throw new Error('audio file is larger than 15 MB');
                    await this.socket.sendMessage(chat,{
                        audio,
                        mimetype:'audio/mpeg',
                        fileName:`${info.title.slice(0,60)}.mp3`,
                        ptt:false
                    });
                    if(wait?.key) await this.socket.sendMessage(chat,{text:'✅ Song sent',edit:wait.key});
                }catch(e){
                    if(wait?.key) await this.socket.sendMessage(chat,{text:`❌ Song failed: ${e.message}`,edit:wait.key});
                    else await this.send(chat,`❌ Song failed: ${e.message}`);
                }
                return;
            }

            if(allowed && (cmd==='.floodbypass'||cmd=='.+floodbypass'||cmd==='./floodbypass')){
                const floodArg=body.split(/\s+/)[1]?.toLowerCase()||'status';
                const requestedMode=floodArg==='off'?'ON (safe mode is fixed)':'ON';
                await this.send(chat,
                    `${TAG}\n\n🛡️ ${dark('SAFE RATE-LIMIT MODE')}\n`+
                    `🟢 Automatic backoff: ${requestedMode}\n`+
                    `⏱️ 429/503 responses are retried with increasing delays\n`+
                    `🚫 Flood-limit bypass is not enabled\n\n`+
                    `${g('usage')}: floodbypass on | off | status`
                );
                return;
            }

            if(!allowed) return;

            // ══ KILLALL ════════════════════════════════════
            if(cmd==='.killall'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.push('kill_all',{chat},this.id); return;
            }

            // ══ SPEED control ══════════════════════════════
            if(body.toLowerCase().startsWith('.speed ')){
                const parts=body.slice(7).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 ${g('usage')}: .speed [f1-f7] [ms]`); return; }
                const setId=parts[0].toLowerCase(), ms=parseInt(parts[1]);
                if(!SET_KEYS[setId]){ await this.send(chat,`❌ ${g('use f1 to f7')}`); return; }
                if(isNaN(ms)||ms<0){ await this.send(chat,`⏱️ ${g('minimum 0ms')}`); return; }
                timingMap[setId]=ms; saveTiming();
                await this.send(chat,`${TAG}\n\n⏱️ ${setId.toUpperCase()} ${g('speed set to')} ${ms}ms`);
                return;
            }

            // ══ .allnc ══════════════════════════════════════
            if(body.toLowerCase().startsWith('.allnc ')){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt=body.slice(7).trim();
                if(!txt){ await this.send(chat,`📋 .allnc [${g('text')}]`); return; }
                await this.hub.router.push('allnc_start',{chat,txt},this.id); return;
            }
            if(cmd==='.stopallnc'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.push('allnc_stop',{chat},this.id); return;
            }

            // ══ NAME CHANGE .f1 – .f7 ════════════════════
            for(const [key,setName] of Object.entries(SET_KEYS)){
                if(body.toLowerCase().startsWith(`.${key} `)){
                    const txt=body.slice(4).trim();
                    if(!txt){ await this.send(chat,`📋 .${key} [${g('text')}]`); return; }
                    if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                    await this.hub.router.pushAll('nc_start',{chat,txt,key,setName},this.id); return;
                }
            }
            if(cmd==='.fstop'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('nc_stop',{chat},this.id); return;
            }

            // ══ .nc WORD CYCLE ══════════════════════════════
            if(/^\.(nc)\s+\S/i.test(body) && !/^\.(nc[0-9])/i.test(body.toLowerCase())){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt=body.slice(4).trim();
                await this.hub.router.pushAll('word_start',{chat,txt},this.id); return;
            }
            if(cmd==='.stopnc'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('word_stop',{chat},this.id); return;
            }

            // ══ .conemo FLAG CYCLE ══════════════════════════
            if(body.toLowerCase().startsWith('.conemo ')){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt=body.slice(8).trim();
                await this.hub.router.pushAll('flag_start',{chat,txt},this.id); return;
            }
            if(cmd==='.stopconemo'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('flag_stop',{chat},this.id); return;
            }

            // ══ .ncemo EMOJI CYCLE ══════════════════════════
            if(body.toLowerCase().startsWith('.ncemo ')){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const txt=body.slice(7).trim();
                await this.hub.router.pushAll('emo_start',{chat,txt},this.id); return;
            }
            if(cmd==='.stopncemo'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.pushAll('emo_stop',{chat},this.id); return;
            }

            // ══ .spam (15-LINE 4-WAR-STYLES SEQUENTIAL SPAM) ═════════════════
            if(cmd === '.spam' || body.toLowerCase().startsWith('.spam ') || cmd === 'spam' || body.toLowerCase().startsWith('spam ')){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const rawArgs = body.replace(/^\.?spam\s*/i, '').trim().split(/\s+/).filter(Boolean);
                const { target, ms } = parseTargetAndMs(rawArgs, 500);
                await this.hub.router.push('spam_start', { chat, target, ms }, this.id); return;
            }
            if(cmd === '.stopspam' || cmd === 'stopspam' || cmd === '.stop' || cmd === 'stop'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.push('spam_stop', { chat }, this.id); return;
            }

            // ══ .swipe ══════════════════════════════════════
            if(body.toLowerCase().startsWith('.swipe')){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                const reply=body.slice(6).trim()||'👁️';
                await this.hub.router.push('swipe_start',{chat,reply},this.id); return;
            }
            if(cmd==='.stopswipe'){
                if(!isGroup){ await this.send(chat,`👥 ${g('groups only')}`); return; }
                await this.hub.router.push('swipe_stop',{chat},this.id); return;
            }

            // ══ .txt ════════════════════════════════════════
            if(body.toLowerCase().startsWith('.txt ')){
                const parts=body.slice(5).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 .txt [${g('text')}] [${g('ms')}]`); return; }
                const ms=parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<30){ await this.send(chat,`⏱️ ${g('minimum 30ms')}`); return; }
                const txt=parts.slice(0,-1).join(' ');
                await this.hub.router.push('txt_start',{chat,txt,ms},this.id); return;
            }
            if(cmd==='.stoptxt'){
                await this.hub.router.push('txt_stop',{chat},this.id); return;
            }

            // ══ .rslide ═════════════════════════════════════
            if(body.toLowerCase().startsWith('.rslide')){
                const quoted=raw.message.extendedTextMessage?.contextInfo?.quotedMessage;
                if(!quoted){
                    await this.send(chat,`↩️ ${g('reply to target first')}\n📋 .rslide [${g('ms')}]`); return;
                }
                const ms=parseInt(body.slice(7).trim());
                if(isNaN(ms)||ms<1000){
                    await this.send(chat,`⏱️ ${g('minimum 1000ms for random slide')}`); return;
                }
                const ctx=raw.message.extendedTextMessage.contextInfo;
                await this.hub.router.push('slide_start',{
                    chat,txt:'',ms,random:true,lines:CUSTOM_SLIDE_LINES,
                    mark:  ctx.participant||ctx.remoteJid,
                    refId: ctx.stanzaId,
                    refMsg:ctx.quotedMessage
                },this.id); return;
            }

            // ══ .slide ══════════════════════════════════════
            if(body.toLowerCase().startsWith('.slide ')){
                if(!raw.message.extendedTextMessage?.contextInfo?.quotedMessage){
                    await this.send(chat,`↩️ ${g('reply to target first')}\n📋 .slide [${g('text')}] [${g('ms')}]`); return;
                }
                const parts=body.slice(7).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 .slide [${g('text')}] [${g('ms')}]`); return; }
                const ms=parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<1){ await this.send(chat,`⏱️ ${g('minimum 1ms for slide')}`); return; }
                const txt=parts.slice(0,-1).join(' ');
                const ctx=raw.message.extendedTextMessage.contextInfo;
                await this.hub.router.push('slide_start',{
                    chat,txt,ms,
                    mark:  ctx.participant||ctx.remoteJid,
                    refId: ctx.stanzaId,
                    refMsg:ctx.quotedMessage
                },this.id); return;
            }
            if(cmd==='.stopslide'||cmd==='.stoprslide'){
                await this.hub.router.push('slide_stop',{chat},this.id); return;
            }

            // ══ .voice ══════════════════════════════════════
            if(body.toLowerCase().startsWith('.voice ')){
                const txt=body.slice(7).trim();
                if(!txt){ await this.send(chat,`📋 .voice [${g('text')}]`); return; }
                try{
                    const {buffer,mimetype,ptt}=await makeTTS(txt);
                    await this.socket.sendMessage(chat,{audio:buffer,mimetype,ptt});
                }catch(e){ await this.send(chat,`❌ ${g('tts failed')}: ${e.message}`); }
                return;
            }

            // ══ .voiceatk ═══════════════════════════════════
            if(body.toLowerCase().startsWith('.voiceatk ')){
                const parts=body.slice(10).trim().split(' ');
                if(parts.length<2){ await this.send(chat,`📋 .voiceatk [${g('text')}] [${g('ms')}]`); return; }
                const ms=parseInt(parts[parts.length-1]);
                if(isNaN(ms)||ms<1000){ await this.send(chat,`⏱️ ${g('minimum 1000ms for voice')}`); return; }
                const txt=parts.slice(0,-1).join(' ');
                await this.hub.router.push('voice_start',{chat,txt,ms},this.id); return;
            }
            if(cmd==='.stopvoice'){
                await this.hub.router.push('voice_stop',{chat},this.id); return;
            }

            // ══ .img ════════════════════════════════════════
            if(body.toLowerCase().startsWith('.img ')){
                if(!raw.message.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage){
                    await this.send(chat,`📸 ${g('reply to an image first')}\n📋 .img [${g('ms')}]`); return;
                }
                const ms=parseInt(body.slice(5).trim());
                if(isNaN(ms)||ms<100){ await this.send(chat,`⏱️ ${g('minimum 100ms for images')}`); return; }
                const ctx=raw.message.extendedTextMessage.contextInfo;
                const qm={key:{remoteJid:chat,fromMe:false,id:ctx.stanzaId,participant:ctx.participant},message:ctx.quotedMessage};
                try{
                    const buf=await downloadMediaMessage(qm,'buffer',{});
                    await this.hub.router.push('img_start',{
                        chat,ms,
                        data:buf.toString('base64'),
                        mime:ctx.quotedMessage.imageMessage.mimetype||'image/jpeg'
                    },this.id);
                }catch(e){ await this.send(chat,`❌ ${g('could not download image')}`); }
                return;
            }
            if(cmd==='.stopimg'){
                await this.hub.router.push('img_stop',{chat},this.id); return;
            }

        }catch(e){ console.error(`[${this.id}] receive err:`,e.stack||e); }
    }

    // ── command executor — runs on ALL linked bots ─
    async handle(cmd, payload, notify=true){
        const {chat} = payload;
        try{
            switch(cmd){

            // ── 📊 POLL START / STOP ACTIONS (ADDED) ──────
            case 'poll_start':{
                const {name, values, selectableCount = 1, ms = 2000} = payload;
                const tid = `${chat}__poll`;
                if(this.pollLoop.has(tid)){
                    this.pollLoop.get(tid).on = false;
                    await delay(100);
                }
                const t = {on: true};
                this.pollLoop.set(tid, t);
                (async()=>{
                    let pBackoff = 0;
                    while(t.on){
                        if(!this.socket || !this.online){ await delay(2000); continue; }
                        try{
                            await this.socket.sendMessage(chat, {
                                poll: {
                                    name: dark(name),
                                    values: values.map(v => dark(v)),
                                    selectableCount: Number(selectableCount) || 1
                                }
                            });
                            pBackoff = 0;
                            await delay(ms);
                        }catch(e){
                            if(isRateErr(e)){
                                pBackoff = Math.min(pBackoff + 2000, 15000);
                                await delay(pBackoff);
                            } else {
                                await delay(ms);
                            }
                        }
                    }
                })();
                if(notify) await this.send(chat, win(`.pollatk (${ms}ms) 📊`));
                break;
            }
            case 'poll_stop':{
                const tid = `${chat}__poll`;
                if(this.pollLoop.has(tid)){
                    this.pollLoop.get(tid).on = false;
                    this.pollLoop.delete(tid);
                }
                if(notify) await this.send(chat, lose('.pollatk 📊'));
                break;
            }

            // ── .allnc ──────────────────────────────────
            case 'allnc_start':{
                const {txt}=payload;
                const tid=`${chat}__allnc`;
                if(this.allNcLoop.has(tid)){this.allNcLoop.get(tid).on=false;await delay(100);}
                const t={on:true};
                this.allNcLoop.set(tid,t);
                (async()=>{
                    let i=0, allBackoff=0;
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{
                            await this.socket.groupUpdateSubject(
                                chat,
                                `${dark(txt)} ${ALL_NC_EMOJIS[i++%ALL_NC_EMOJIS.length]}`
                            );
                            allBackoff=0;
                            await delay(ALL_NC_DELAY);
                        }catch(e){
                            if(isRateErr(e)){
                                allBackoff=Math.min(allBackoff+2000,15000);
                                await delay(allBackoff);
                            } else {
                                await delay(ALL_NC_DELAY);
                            }
                        }
                    }
                })();
                if(notify) await this.send(chat,win(`.allnc (${ALL_NC_DELAY}ms)`));
                break;
            }
            case 'allnc_stop':{
                const tid=`${chat}__allnc`;
                if(this.allNcLoop.has(tid)){
                    this.allNcLoop.get(tid).on=false;
                    this.allNcLoop.delete(tid);
                }
                if(notify) await this.send(chat,lose('.allnc'));
                break;
            }

            // ── .f1–.f7 ──────────────────────────────────
            case 'nc_start':{
                const {txt,key,setName}=payload;
                const emojis=SETS[setName];
                const ms=timingMap[key]??0;
                for(let t=0;t<15;t++){
                    const tid=`${chat}__nc_${key}_${t}`;
                    this.nameLoops.set(tid,true);
                    let i=t*Math.floor(emojis.length/15);
                    let backoff=0;
                    (async()=>{
                        await delay(0);
                        while(this.nameLoops.get(tid)){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            try{
                                await this.socket.groupUpdateSubject(chat,`${dark(txt)} ${emojis[i++%emojis.length]}`);
                                backoff=0;
                                await delay(ms);
                            }catch(e){
                                if(isRateErr(e)){
                                    backoff=Math.min(backoff+2000, 15000);
                                    await delay(backoff);
                                } else {
                                    await delay(ms);
                                }
                            }
                        }
                    })();
                }
                if(notify) await this.send(chat,win(`${key} ${g('name change')}`));
                break;
            }
            case 'nc_stop':{
                let n=0;
                for(const [k] of this.nameLoops) if(k.startsWith(chat)){this.nameLoops.delete(k);n++;}
                if(n&&notify) await this.send(chat,lose(g('name change')));
                break;
            }

            // ── .nc word cycle ───────────────────────────
            case 'word_start':{
                const {txt}=payload;
                const tid=`${chat}__wl`;
                if(this.wordLoop.has(tid)){this.wordLoop.get(tid).on=false;await delay(50);}
                const t={on:true,i:0};
                let wBackoff=0;
                this.wordLoop.set(tid,t);
                (async()=>{
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{
                            await this.socket.groupUpdateSubject(chat,`${dark(txt)} ${WORD_CYCLE[t.i++%WORD_CYCLE.length]}`);
                            wBackoff=0;
                            await delay(0);
                        }catch(e){
                            if(isRateErr(e)){ wBackoff=Math.min(wBackoff+2000,15000); await delay(wBackoff); }
                            else await delay(0);
                        }
                    }
                })();
                if(notify) await this.send(chat,win('.nc '+g('word cycle')));
                break;
            }
            case 'word_stop':{
                for(const [k,v] of this.wordLoop) if(k.startsWith(chat)){v.on=false;this.wordLoop.delete(k);}
                if(notify) await this.send(chat,lose('.nc '+g('word cycle')));
                break;
            }

            // ── .conemo flag cycle ───────────────────────
            case 'flag_start':{
                const {txt}=payload;
                const tid=`${chat}__fl`;
                if(this.flagLoop.has(tid)){this.flagLoop.get(tid).on=false;await delay(50);}
                const t={on:true};
                this.flagLoop.set(tid,t);
                for(let i=0;i<6;i++){
                    (async(offset)=>{
                        let idx=offset*3, fBack=0; await delay(0);
                        while(t.on){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            try{
                                await this.socket.groupUpdateSubject(chat,`${dark(txt)} ${FLAG_CYCLE[idx++%FLAG_CYCLE.length]}`);
                                fBack=0; await delay(0);
                            }catch(e){
                                if(isRateErr(e)){ fBack=Math.min(fBack+2000,15000); await delay(fBack); }
                                else await delay(0);
                            }
                        }
                    })(i);
                }
                if(notify) await this.send(chat,win('.conemo '+g('flag cycle')));
                break;
            }
            case 'flag_stop':{
                for(const [k,v] of this.flagLoop) if(k.startsWith(chat)){v.on=false;this.flagLoop.delete(k);}
                if(notify) await this.send(chat,lose('.conemo'));
                break;
            }

            // ── .ncemo emoji cycle ───────────────────────
            case 'emo_start':{
                const {txt}=payload;
                const tid=`${chat}__el`;
                if(this.emojiLoop.has(tid)){this.emojiLoop.get(tid).on=false;await delay(50);}
                const t={on:true};
                this.emojiLoop.set(tid,t);
                for(let i=0;i<6;i++){
                    (async(offset)=>{
                        let idx=offset*3, eBack=0; await delay(0);
                        while(t.on){
                            if(!this.socket||!this.online){ await delay(2000); continue; }
                            try{
                                await this.socket.groupUpdateSubject(chat,`${dark(txt)} ${EMO_CYCLE[idx++%EMO_CYCLE.length]}`);
                                eBack=0; await delay(0);
                            }catch(e){
                                if(isRateErr(e)){ eBack=Math.min(eBack+2000,15000); await delay(eBack); }
                                else await delay(0);
                            }
                        }
                    })(i);
                }
                if(notify) await this.send(chat,win('.ncemo '+g('emoji cycle')));
                break;
            }
            case 'emo_stop':{
                for(const [k,v] of this.emojiLoop) if(k.startsWith(chat)){v.on=false;this.emojiLoop.delete(k);}
                if(notify) await this.send(chat,lose('.ncemo'));
                break;
            }

            // ── .spam (15-LINE 4-WAR-STYLES SEQUENTIAL SPAM) ─────────────
            case 'spam_start':{
                const { target = 'जैक - लवी', ms = 500 } = payload;
                const safeMs = Math.max(Number(ms) || 500, 10);
                const tid = `${chat}__sp`;
                if(this.spamLoop.has(tid)){
                    this.spamLoop.get(tid).on = false;
                    await delay(50);
                }
                const t = { on: true };
                this.spamLoop.set(tid, t);

                let cycleIdx = 0;
                (async () => {
                    let sBack = 0;
                    while(t.on){
                        if(!this.socket || !this.online){ await delay(2000); continue; }
                        try{
                            // Strictly 1-by-1 sequence: Style 1 -> 2 -> 3 -> 4 -> 1...
                            const templateStr = WAR_4_STYLES[cycleIdx % WAR_4_STYLES.length];
                            cycleIdx++;
                            const msgToSend = render15LineBomb(templateStr, target);
                            await this.socket.sendMessage(chat, { text: msgToSend });
                            sBack = 0;
                            await delay(safeMs);
                        }catch(e){
                            if(isRateErr(e)){
                                sBack = Math.min(sBack + 1500, 10000);
                                await delay(sBack);
                            } else {
                                await delay(safeMs);
                            }
                        }
                    }
                })();
                if(notify) {
                    await this.send(chat, 
                        `💣 *GOJO 15-LINE 4-WAR-STYLES SPAM STARTED* 💣\n` +
                        `🎯 Target: ${target}\n` +
                        `⏱️ Delay: ${safeMs}ms\n` +
                        `🔄 4 War Styles Cycling 1-by-1 (15 Lines each)\n` +
                        `🛑 Type *.stopspam* to stop!`
                    );
                }
                break;
            }
            case 'spam_stop':{
                let stopped = false;
                for(const [k,v] of this.spamLoop){
                    if(k.startsWith(chat)){
                        v.on = false;
                        this.spamLoop.delete(k);
                        stopped = true;
                    }
                }
                if(notify && stopped){
                    await this.send(chat, '🛑 *ALL SPAM LOOPS TERMINATED.*');
                }
                break;
            }

            // ── .swipe ────────────────────────────────────
            case 'swipe_start':{
                const {reply}=payload;
                const styledReply=dark(reply);
                this.swipeLoop.set(`${chat}__sw`,{live:true,reply:styledReply});
                if(notify) await this.send(chat,`${win('.swipe')}  ›  ${styledReply}`);
                break;
            }
            case 'swipe_stop':{
                for(const [k,v] of this.swipeLoop) if(k.startsWith(chat)){v.live=false;this.swipeLoop.delete(k);}
                if(notify) await this.send(chat,lose('.swipe'));
                break;
            }

            // ── .txt ──────────────────────────────────────
            case 'txt_start':{
                const {txt,ms}=payload;
                const tid=`${chat}__tx`;
                if(this.txtLoop.has(tid)){this.txtLoop.get(tid).on=false;await delay(100);}
                const t={on:true};
                this.txtLoop.set(tid,t);
                (async()=>{
                    let tBack=0;
                    while(t.on){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{
                            await this.socket.sendMessage(chat,{text:dark(txt)});
                            tBack=0;
                            await delay(ms);
                        }catch(e){
                            if(isRateErr(e)){ tBack=Math.min(tBack+1500,10000); await delay(tBack); }
                            else await delay(ms);
                        }
                    }
                })();
                if(notify) await this.send(chat,win(`.txt (${ms}ms)`));
                break;
            }
            case 'txt_stop':{
                const tid=`${chat}__tx`;
                if(this.txtLoop.has(tid)){this.txtLoop.get(tid).on=false;this.txtLoop.delete(tid);}
                if(notify) await this.send(chat,lose('.txt'));
                break;
            }

            // ── .slide ────────────────────────────────────
            case 'slide_start':{
                const {txt,ms,mark,refId,refMsg,random=false,lines=[]}=payload;
                const tid=`${chat}__${mark}`;
                if(this.slideLoop.has(tid)){this.slideLoop.get(tid).live=false;await delay(100);}
                const t={
                    live:true, room:chat, mark,
                    ref:{key:{remoteJid:chat,fromMe:false,id:refId,participant:mark},message:refMsg}
                };
                this.slideLoop.set(tid,t);
                (async()=>{
                    let slBack=0, lastRandom=-1;
                    while(t.live){
                        if(!this.socket||!this.online){ await delay(2000); continue; }
                        try{
                            let outgoing=txt;
                            if(random&&lines.length){
                                let next=Math.floor(Math.random()*lines.length);
                                if(lines.length>1&&next===lastRandom) next=(next+1)%lines.length;
                                lastRandom=next;
                                outgoing=lines[next];
                            }
                            await this.socket.sendMessage(chat,{text:dark(outgoing)},{quoted:t.ref});
                            slBack=0;
                            await delay(ms);
                        }catch(e){
                            if(isRateErr(e)){ slBack=Math.min(slBack+1500,10000); await delay(slBack); }
                            else await delay(ms);
                        }
                    }
                })();
                if(notify) await this.send(chat,win(`${random?'.rslide':'.slide'} (${ms}ms)`));
                break;
            }
            case 'slide_stop':{
                for(const [k,v] of this.slideLoop) if(v.room===chat){v.live=false;this.slideLoop.delete(k);}
                if(notify) await this.send(chat,lose('.slide'));
                break;
            }

            // ── .voiceatk ─────────────────────────────────
            case 'voice_start':{
                const {txt,ms}=payload;
                const tid=`${chat}__vc`;
                if(this.voiceLoop.has(tid)){this.voiceLoop.get(tid).on=false;await delay(200);}
                const t={on:true};
                this.voiceLoop.set(tid,t);
                (async()=>{
                    while(t.on){
                        try{
                            const {buffer,mimetype,ptt}=await makeTTS(txt);
                            await this.socket.sendMessage(chat,{audio:buffer,mimetype,ptt});
                            await delay(ms);
                        }catch{ await delay(ms); }
                    }
                })();
                if(notify) await this.send(chat,win('.voiceatk 🎤'));
                break;
            }
            case 'voice_stop':{
                const tid=`${chat}__vc`;
                if(this.voiceLoop.has(tid)){this.voiceLoop.get(tid).on=false;this.voiceLoop.delete(tid);}
                if(notify) await this.send(chat,lose('.voiceatk'));
                break;
            }

            // ── .img ──────────────────────────────────────
            case 'img_start':{
                const {ms,data,mime}=payload;
                const tid=`${chat}__im`;
                if(this.imgLoop.has(tid)){this.imgLoop.get(tid).on=false;await delay(100);}
                const t={on:true,buf:Buffer.from(data,'base64'),mime};
                this.imgLoop.set(tid,t);
                (async()=>{ while(t.on){ try{await this.socket.sendMessage(chat,{image:t.buf,mimetype:t.mime});await delay(ms);}catch{await delay(ms);} } })();
                if(notify) await this.send(chat,win('.img 📸'));
                break;
            }
            case 'img_stop':{
                const tid=`${chat}__im`;
                if(this.imgLoop.has(tid)){this.imgLoop.get(tid).on=false;this.imgLoop.delete(tid);}
                if(notify) await this.send(chat,lose('.img'));
                break;
            }

            // ── .killall ──────────────────────────────────
            case 'kill_all':{
                let killed=0;
                const wipe=(map,check)=>{
                    for(const [k,v] of map){
                        if(check(k,v)){
                            if(v&&typeof v==='object'){
                                if('on'   in v) v.on  =false;
                                if('live' in v) v.live=false;
                            }
                            map.delete(k); killed++;
                        }
                    }
                };
                wipe(this.nameLoops, k     => k.startsWith(chat));
                wipe(this.wordLoop,  k     => k.startsWith(chat));
                wipe(this.flagLoop,  k     => k.startsWith(chat));
                wipe(this.emojiLoop, k     => k.startsWith(chat));
                wipe(this.spamLoop,  k     => k.startsWith(chat));
                wipe(this.swipeLoop, k     => k.startsWith(chat));
                wipe(this.txtLoop,   k     => k.startsWith(chat));
                wipe(this.slideLoop, (_,v) => v.room===chat);
                wipe(this.allNcLoop, k     => k.startsWith(chat));
                wipe(this.fdescLoop,  k     => k===chat);
                wipe(this.gcpfpLoop,  k     => k===chat);
                wipe(this.voiceLoop, k     => k.startsWith(chat));
                wipe(this.imgLoop,   k     => k.startsWith(chat));
                // 📊 POLL LOOP CLEANUP (ADDED)
                wipe(this.pollLoop,  k     => k.startsWith(chat));

                if(killed&&notify) await this.send(chat,HALT_MESSAGE(killed));
                break;
            }

            }
        }catch(e){ console.error(`[${this.id}] handle err:`,e.message); }
    }

    async send(jid,text,mentions=[]){
        if(!this.socket||!this.online){
            console.error(`[${this.id}] send skipped: socket is offline (jid=${jid})`);
            return false;
        }
        let attempts=0;
        while(attempts<3){
            try{
                await this.socket.sendMessage(jid,{text,...(mentions.length?{mentions}:{})});
                return true;
            }catch(e){
                attempts++;
                if(isRateErr(e)){ await delay(3000); }
                else { console.error(`[${this.id}] send err:`,e.stack||e); return false; }
            }
        }
        return false;
    }
}

// ═════════════════════════════════════════════
//  HUB — manages all sessions
// ═════════════════════════════════════════════
class Hub {
    constructor(){
        this.sessions = new Map();
        this.router   = new Router();
        this.count    = 0;
        this.disk     = readJson(PATH_NETWORK,{count:0,list:[]});
        this.count    = this.disk.count||0;
    }

    _save(){
        writeJson(PATH_NETWORK,{
            count:this.count,
            list:[...this.sessions.entries()].map(([id,s])=>({id,phone:s.phone,online:s.online}))
        });
    }

    async boot(){
        const saved=this.disk.list||[];
        if(saved.length){
            console.log(`[GOJO-BOT] restoring ${saved.length} session(s)…`);
            for(const entry of saved){
                const ap=PATH_AUTH(entry.id);
                const hasFiles=fs.existsSync(ap)&&fs.readdirSync(ap).length>0;
                let phone=entry.phone;
                if(!hasFiles&&!phone){
                    phone=await question(`Enter number for ${entry.id} (e.g. 919876543210): `);
                    phone=phone.replace(/\D/g,'');
                    if(!phone||phone.length<10) continue;
                }
                const s=new Session(entry.id,phone,this,null);
                this.sessions.set(entry.id,s);
                this.router.attach(entry.id,s);
                await s.init();
                await delay(1500);
            }
            this._save();
        } else {
            const ph=await question('Enter number for first bot (or press Enter to skip): ');
            if(ph?.trim()){ const c=ph.replace(/\D/g,''); if(c.length>=10) await this.link(c,null); }
            else console.log('[GOJO-BOT] skipped — send addbot in WhatsApp to add a bot\n');
        }
    }

    async link(phone,notifyJid=null){
        this.count++;
        const id=`X${this.count}`;
        const s=new Session(id,phone,this,notifyJid);
        this.sessions.set(id,s);
        this.router.attach(id,s);
        await s.init();
        this._save();
        return `${TAG}\n\n⏳ ${g('session')} ${id} ${g('created for')} +${phone}\n🔑 ${g('pairing code will arrive shortly')}\n\n${g('check the next message for the code')}`;
    }

    unlink(id){
        if(this.sessions.has(id)){ this.router.detach(id); this.sessions.delete(id); this._save(); }
    }
}

// ─────────────────────────────────────────────
//  START
// ─────────────────────────────────────────────
console.log(`
◈  ɢᴏᴊᴏ ʙᴏᴛ  ⚡ + 📊 ᴘᴏʟʟ ᴄᴏʀᴇ + 💣 𝟏𝟓-𝐋ɪɴᴇ 𝟒-𝐖ᴀʀ 𝐒ᴘᴀᴍ

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  commands  :  poll  mpoll  pollatk  stoppoll
               spam  stopspam
               f1–f7  nc  conemo  ncemo
               swipe  txt  slide
               voice  voiceatk  img
  stop all  :  killall  /  stopspam  /  stoppoll
  threads   :  Multi-bot Fleet Sync ⚡
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

const hub = new Hub();
await hub.boot();
rl.close();

console.log(`\n  ✅  GOJO bot with 4-War-Styles Spam & Poll Core is live`);
console.log(`  →   send admin in DM to claim owner 🔐`);
console.log(`  →   send menu in group to see commands ⚡\n`);
      