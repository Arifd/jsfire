class Hissing
{
	constructor()
	{
		this.buffer = audioCtx.createBuffer(numChannels, bufferSize, audioCtx.sampleRate);

		this.gain = 1;
		this.noiseSeed = 1;

		this.lop = new Biquad();
		this.shelf = new Biquad();

    	this.lop.setBiquad("lowpass", 100 / sampleRate, 2, 2);
    	this.shelf.setBiquad("highshelf", 2000 / sampleRate, 0, 15);
	}

	setSize(value)
    { // value between 0 - 1
        // this.gain = Math.pow(value, 2.7); // was 1.2
        this.lopFreq = map(value, 0.0, 1.0, 10, 100.0);
        this.lop.setFreq(this.lopFreq/ sampleRate);
        this.noiseSeed = map(value, 0.0, 1.0, 0.02, 1.0);
    }

	generate()
	{
		// loop through every frame
		for (let i = 0; i < bufferSize; i++)
		{
			// calc per sample noise
			// noise2 wants to be EITHER +1 or -1
			this.noise1 = Math.random() * 2 - 1;
			this.noise2 = (Math.random() >= 0.5) * 2 - 1;

			this.noise2 *= this.noiseSeed;

			// filter noise2
        	this.noise2 = this.lop.process(this.noise2);

        	this.noise2 * this.noise2 * this.noise2 * this.noise2;

        	// multiply and set final volume
        	this.output = (this.shelf.process(this.noise1 * this.noise2) * 0.08) * this.gain;

			// write out result (for every channel)
			for (let channel = 0; channel < numChannels; channel++)
			{
				this.data = this.buffer.getChannelData(channel);
				this.data[i] = (this.output);
			}
		} 

		return this.buffer;
	}

}