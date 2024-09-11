import { Controller } from "@hotwired/stimulus"
import { pipeline } from '@xenova/transformers';

const speaker_embeddings = 'https://huggingface.co/datasets/Xenova/transformers.js-docs/resolve/main/speaker_embeddings.bin';

export default class extends Controller {
  static targets = ["text", "trigger"]

  async initialize() {
    this.triggerTarget.disabled = true;
    this.synthesizer = await pipeline('text-to-speech');
    this.triggerTarget.disabled = false;
  }

  async play() {
    const previousLabel = this.triggerTarget.textContent;
    this.triggerTarget.textContent = 'Preparing...';
    this.triggerTarget.disabled = true;

    const audioData = await this.synthesizer(this.textTarget.textContent, { speaker_embeddings });

    this.triggerTarget.textContent = 'Reading...';
    this.#playAudio(audioData);

    this.triggerTarget.textContent = previousLabel;
    this.triggerTarget.disabled = false;
  }

  #playAudio(audioData) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const audioBuffer = audioContext.createBuffer(1, audioData.audio.length, audioData.sampling_rate);
    audioBuffer.copyToChannel(audioData.audio, 0, 0);

    const source = audioContext.createBufferSource();
    source.buffer = audioBuffer;
    source.connect(audioContext.destination);

    source.start();
  }
}
