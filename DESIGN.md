# Flashbrix Design Contract

This file is the implementation ledger for the Flashbrix frontend. Figma is the primary visual source of truth; this document records the approved decisions and stable identifiers required to implement them without creating orphan components or styles.

## Source of truth

- Figma file: `Flashbrix v1.0`
- File key: `Y0KtoT4HYoGFEPflChy4Cj`
- Working page: `Hero — Read Mark Flashcard` (`400:520`)
- Foundations root: `Flashbrix Hero System` (`400:521`)
- Approved hero frame: `Hero / Read Mark Flashcard` (`410:706`)
- Motion specification frame: `Motion Specs / Read Mark Flashcard` (`413:821`)

## Owner decision

Approved by Alander on 2026-09-12:

- Create `FlashCard` as a new component. Do not extend `context-card` or `ValueCard`; their existing semantics are different.
- EB Garamond is canonical for display and reader text.
- Montserrat is canonical for body and UI text.
- `#4541C0` is the canonical hero accent.
- Reuse the existing CTA and language components. Do not duplicate them.
- Every new component, variable, and text style must have at least one consumer in Figma before frontend implementation.

## Existing ADS assets reused

| Asset | Component set | Variant(s) used | Notes |
| --- | --- | --- | --- |
| Button | `10:91` | `10:87` primary; `10:92` authentication | Preserved for product actions. |
| CTA | `219:160` | `219:159` size L; `219:161` size S | Existing variants were rebound to `color/accent` and Montserrat SemiBold. Hero instance: `410:711`. |
| Language chips | `327:3692` | English `336:919`; Italian `336:777`; French `336:808`; Spanish `336:827` | Hero instances: `410:715`, `410:718`, `410:721`, `410:727`. |
| Context card | `97:357` | `97:356` | Preserved; not used as FlashCard. |
| ValueCard | `219:147` | `219:113`, `219:148` | Preserved; not used as FlashCard. |

## Variables

Collection: `Flashbrix Hero` — ID `VariableCollectionId:400:507`, key `5b7b588bd24adb5e5517c863b59aaedbf2d40def`, mode `Value` (`400:0`).

| Variable | Value | Variable ID | Key | Web syntax |
| --- | --- | --- | --- | --- |
| `color/accent` | `#4541C0` | `VariableID:400:508` | `8a3771b2727bc8f799d81d3046ac306891c43504` | `var(--fb-hero-accent)` |
| `color/mint` | `#99C9C1` | `VariableID:400:509` | `5db77feb1ae17f3338af0b112aab2a2a97a81165` | `var(--fb-hero-mint)` |
| `color/mint-soft` | `#CCE6E2` | `VariableID:400:510` | `6558d03bd90a2d1649d29b93848bf41ab3c41ecc` | `var(--fb-hero-mint-soft)` |
| `color/surface-dark` | `#1B2740` | `VariableID:400:511` | `18e238cc3a28bdf847ce4391b596b9a94b55f44d` | `var(--fb-hero-surface-dark)` |
| `color/ink-serif` | `#4A2647` | `VariableID:400:512` | `24b3944b9d547ab084a5761b870a81855e984cde` | `var(--fb-hero-ink-serif)` |
| `color/ink` | `#1A1A1A` | `VariableID:400:513` | `041960681d1e465862bdb0a6507bf6cb5acc3915` | `var(--fb-hero-ink)` |
| `color/bg` | `#FBF8F2` | `VariableID:400:514` | `abd33fd6eb14075d6fce8aede739cfd6892f106c` | `var(--fb-hero-bg)` |

All variables have explicit scopes and Web syntax; none use `ALL_SCOPES`.

## Text styles

| Style | ID | Key | Definition |
| --- | --- | --- | --- |
| `Flashbrix Hero/Display` | `S:b4f7c308c37b7016457ce88b8bf96eb707a62060,` | `b4f7c308c37b7016457ce88b8bf96eb707a62060` | EB Garamond Medium, 72/78 |
| `Flashbrix Hero/Reader Line` | `S:efe5230c828a62dc4db2947300d0da00038f835c,` | `efe5230c828a62dc4db2947300d0da00038f835c` | EB Garamond Regular, 28/38 |
| `Flashbrix Hero/Body Lead` | `S:75711d9d11bde9ed8ddf8b1ec74b430c8911cf7b,` | `75711d9d11bde9ed8ddf8b1ec74b430c8911cf7b` | Montserrat Medium, 20/32 |
| `Flashbrix Hero/UI Label` | `S:820e9038f084c0a574ea4cd245ba168bf9e3ec3c,` | `820e9038f084c0a574ea4cd245ba168bf9e3ec3c` | Montserrat SemiBold, 14/20 |
| `Flashbrix Hero/UI Body` | `S:be624827556e27a0aa8a616f42310e4fed08086e,` | `be624827556e27a0aa8a616f42310e4fed08086e` | Montserrat Medium, 16/24 |

## New component families

### VocabMark

- Component set: `404:514`
- Component property: `Word#404:0`
- Variants:
  - `State=Default`: `404:508`, key `fca5a7380f89d896f2858192888b309b98606d03`
  - `State=Marked`: `404:510`, key `b3199c339ac9d1b8bbb48d6227116eaa76403286`
  - `State=Just-added`: `404:512`, key `3a2c268d42f572f7d0f261acad4e9104476444f5`
- Geometry: 4px corner radius. It is an angular inline highlight, not a Wispr-style pill.

### MiniAudio

- Component set: `405:533`
- Component property: `Duration#405:0`
- Variants:
  - `State=Idle`: `405:507`, key `bb7938faf7e3c8cfd6f5fdd5564d89362cb3d548`
  - `State=Playing`: `405:520`, key `54f56e905e2b97451c743d56c9c22687eff5661a`
- Used by every FlashCard variant.

### KaraokeLine

- Component set: `406:513`
- Component property: `Line#406:0`
- Variants:
  - `State=Past-dim`: `406:507`, key `192c355b4f3b240e29521af60db3d14b1f1d8e87`
  - `State=Upcoming-dim`: `406:509`, key `cb1aa805eb96dead0bfa85d19ffb4e4137f38b20`
  - `State=Current-bright`: `406:511`, key `eddf4285530545701278ab695a04875a0e0d62d8`

### KaraokeReader

- Component: `407:507`
- Component key: `8897df5c944fffc0bc7593b5cd701653c6a8741c`
- Hero instance: `410:734`
- Contains three KaraokeLine instances, progress, play, and a `VocabMark` instance.
- `Current-bright` is static; emphasis comes from contrast and the separate VocabMark.

### FlashCard

- Component set: `408:599`
- Properties: `Word#408:0`, `Description#408:5`, `Translation#408:10`
- Variants:
  - `Deck=Front`: `408:511`, key `fb298c802841087b0570861dfe05f53b492ecc81`
  - `Deck=Stack-1`: `408:533`, key `9790362efa1c0953b1c6473a5dc18e04d2559ff4`
  - `Deck=Stack-2`: `408:555`, key `42f22f2eeeb626da58ed098ebdb1efe48ee04afe`
  - `Deck=Entering`: `408:577`, key `290f4dd9dfcd3ead93d78935b4da2b9fb28d53ad`
- Slots represented in the component: image, grammar metadata, word, description, translation, pronunciation.

### FlashCardDeck

- Component set: `409:715`
- Variants:
  - `State=Rest`: `409:559`, key `a4cd86bf087554262356583f34321555faacc350`
  - `State=Push`: `409:626`, key `8e477b305ee7e372794fce7d3070b5723320abfe`
- Hero instance: `410:750`
- `Rest` shows front + two receded cards. `Push` introduces `Entering` and recedes the previous front card.

## Hero composition

Frame `410:706`, 1280 × 1040, auto layout:

- Left `Hero / Content` (`410:707`): EB Garamond headline, Montserrat lead, existing CTA L and four existing language chips.
- Right `Hero / Interaction` (`410:733`): `color/surface-dark`, KaraokeReader instance and FlashCardDeck Rest instance.

## Motion

| Motion | Duration | Easing | Behavior |
| --- | --- | --- | --- |
| Karaoke scroll | 650ms | `EASE_IN_AND_OUT`; `cubic-bezier(0.65, 0, 0.35, 1)` | Current line moves up 38px; upcoming becomes current-bright. |
| VocabMark | 180ms | `QUICK`; ease-out | Opacity 0→1 and scale .96→1; no pill morphing. |
| Card push/update | 420ms | `EASE_OUT`; `cubic-bezier(0.22, 1, 0.36, 1)` | Entering card rises 24px and becomes front after just-added. |
| Deck recoil | 360ms | `EASE_IN_AND_OUT`; `cubic-bezier(0.65, 0, 0.35, 1)` | Previous cards recede 24px per layer without bounce. |

Native Figma timeline tracks:

- KaraokeReader instance `410:734`: `TRANSLATION_Y`, track `KeyframeTrackId:413:844`, keyframes `413:845` and `413:846`.
- FlashCardDeck instance `410:750`: `TRANSLATION_Y`, track `KeyframeTrackId:413:847`, keyframes `413:848` and `413:849`.
- Timeline root `400:521`, duration 2s.

## Implementation contract

1. Figma is the primary visual reference; this file is the stable implementation ledger.
2. The frontend must use the CSS names from the Variables table. Do not introduce alternate hex literals.
3. Replace the current P22 Mackinac landing display usage with EB Garamond for this hero.
4. Replace the current landing CTA value `#574CBC` with `var(--fb-hero-accent)`.
5. Implement the components above as one frontend ownership surface; do not split UI Designer and Frontend Developer ownership.
6. If implementation needs a new component, variant, token, or style, create or approve it in Figma first and append its Figma ID here before coding it.
7. Do not detach or duplicate the existing CTA, language chips, button, context-card, or ValueCard.

## Validation record

Validated on 2026-09-12:

- New component consumers: VocabMark 2, MiniAudio 14, KaraokeLine 6, KaraokeReader 1, FlashCard 10, FlashCardDeck 1.
- All five new text styles have consumers.
- All seven new variables have consumers.
- No unnamed new component/component set.
- Final hero and motion specification screenshots passed visual inspection after fixing auto-layout height compression.
