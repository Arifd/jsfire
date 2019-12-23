class Roaring
{
	constructor()
	{
		this.buffer = audioCtx.createBuffer(numChannels, bufferSize, audioCtx.sampleRate);

		this.gain = 1;
		this.noiseSeed = 1;

		this.bandPass = new Biquad();
		this.lop = new Biquad();
		this.lop2 = new Biquad();
		this.hip = new Biquad();

		this.bandPass.setBiquad("bandpass", 30 / sampleRate, 1.5, 2);
		this.lop.setBiquad("lowpass", 800 / sampleRate, 0.707, 2);
		this.lop2.setBiquad("lowpass", 2875 / sampleRate, 0.707, 2);
		this.hip.setBiquad("highpass", 30 / sampleRate, 0.707, 2);
	}

	setSize(value)
    { // value between 0 - 1
        // this.gain = Math.pow(value, 2.0);
        this.boomAmount = map(value, 0.0, 1.0, 100.0, 30.0);
        this.hip.setFreq(this.boomAmount/sampleRate);
        this.bandPass.setFreq(this.boomAmount/sampleRate);
        this.lopFreq = map(Math.pow(value, 2.5), 0.0, 1.0, 10.0, 800.0);
        this.lop.setFreq(this.lopFreq/sampleRate);
        this.noiseSeed = map(value, 0.0, 1.0, 0.02, 1.0);
    }

	generate()
	{
		// loop through every frame
		for (let i = 0; i < bufferSize; i++)
		{
			// calc per sample noise
			// noise1 wants to be EITHER +1 or -1
			this.noise1 = (Math.random() >= 0.5) * 2 - 1;
			this.noise2 = Math.random() * 2 - 1;

			this.noise2 *= this.noiseSeed;

			this.noise2 = this.lop.process(this.noise2);

			this.noiseCombined = (this.noise1 * 0.5) * (this.noise2 * 0.5);

			this.noiseCombined = this.bandPass.process(this.noiseCombined) * 40;
			this.noiseCombined = this.lop2.process(this.noiseCombined);

			this.output = this.hip.process(this.noiseCombined) * this.gain;

			// write out result (for every channel)
			for (let channel = 0; channel < numChannels; channel++)
			{
				this.data = this.buffer.getChannelData(channel);
				this.data[i] = this.output;
			}
		} 

		return this.buffer;
	}

}