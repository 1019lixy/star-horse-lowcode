# AudioItem Audio Player Component

## Overview
AudioItem is an audio player component implemented based on HTML5's audio element, used for playing audio files. The component supports loading audio data from remote addresses and playing it.

## Props

| Prop Name | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------|
| isDesign | Boolean | No | false | Whether it is design mode |
| disabled | Boolean | No | false | Whether it is disabled |
| showFormItem | Boolean | No | false | Whether to show form item |
| bareFlag | Boolean | No | false | Whether it is bare mode |
| isSearch | Boolean | No | false | Whether it is search mode |

## Events

| Event Name | Parameters | Description |
|------------|------------|-------------|
| selfFunc | - | Custom function event |
| selectItem | - | Select item event |

## Methods

### bufferToWave
Convert AudioBuffer to WAV format Blob object
```typescript
bufferToWave(abuffer: any, len: number): Blob
```

## Data Structures

### Field Configuration (field)
```typescript
interface FieldConfig {
  fieldName: string;      // Field name
  audioUrl: string;       // Audio file URL
  // Other field properties...
}
```

## Usage Example

```vue
<template>
  <audio-item
    :field="fieldConfig"
  />
</template>

<script setup>
import { ref } from 'vue'

const fieldConfig = ref({
  fieldName: 'audio',
  label: 'Audio',
  type: 'audio',
  audioUrl: '/api/audio/file.mp3'  // Audio file URL
})
</script>
```

## Notes

1. The component gets the audio file URL through the [field.audioUrl] property
2. The component uses XMLHttpRequest to load audio data and convert it to a Blob object
3. Supports decoding audio data to AudioBuffer for processing
4. Can convert AudioBuffer to WAV format Blob object for playback
5. The component is based on HTML5's audio element and supports basic playback controls
6. After audio data is loaded, it will be automatically set to the audio element's src attribute