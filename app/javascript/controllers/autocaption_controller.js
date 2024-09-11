import { Controller } from "@hotwired/stimulus"
import { pipeline, RawImage } from '@xenova/transformers';

export default class extends Controller {
  static targets = ["output", "trigger"]

  async initialize() {
    this.triggerTarget.disabled = true;
    this.captioner = await pipeline('image-to-text');
  }

  saveAttachment(event) {
    this.attachment = event.attachment
    this.triggerTarget.disabled = false;
  }

  async describeImage() {
    const previousLabel = this.triggerTarget.textContent;
    this.triggerTarget.textContent = 'Analyzing...';
    this.triggerTarget.disabled = true;

    const img = await RawImage.fromBlob(this.attachment.file);
    const caption = (await this.captioner(img))[0].generated_text;

    this.outputTarget.textContent = caption;
    this.triggerTarget.textContent = previousLabel;
  }
}
