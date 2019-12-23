class SineWave
{
	constructor(freq = 220)
	{
		this.buffer = audioCtx.createBuffer(numChannels, bufferSize, audioCtx.sampleRate);
		this.freq = freq;
		this.phase = 0;
		this.time = 0.0;
		this.delta_time = 1 / sampleRate;
	}

	setFreq(value) {this.freq = value * 1000;}

	generate()
	{
		// loop through every frame
		for (let i = 0; i < bufferSize; i++)
		{
			let value = Math.sin(2 * TWO_PI * this.freq * this.time + this.phase) * 0.1;

			// write out result (for every channel)
				for (let channel = 0; channel < numChannels; channel++)
				{
					let data = this.buffer.getChannelData(channel);
					data[i] = value;
				}

			this.time += this.delta_time;
		}
		
		return this.buffer;
	}
}