class Crackling
{
	constructor()
	{
		this.buffer = audioCtx.createBuffer(numChannels, bufferSize, audioCtx.sampleRate);

		this.gain = 1;
		this.crackleAmount = 0.99975;
		this.env = new Glide();
		this.bandPass = new Biquad();
		this.lop = new Biquad();

		this.bandPass.setBiquad("bandpass", 1650 / sampleRate, 1.5, 2);
        this.lop.setBiquad("lowpass", 8200 / sampleRate, 0.707, 0);
	}

	setSize(value)
    {
        // this.gain = Math.pow(value, 0.5); 
        this.crackleAmount = map(Math.pow(value, 1.5), 0.0, 1.0, 1.0, 0.99975);
    }


	zero()
	{
		for (let i = 0; i < bufferSize; i++)
		{
				for (let channel = 0; channel < numChannels; channel++)
				{
					this.data = this.buffer.getChannelData(channel);
					this.data[i] = 0;
				}
		}
	}

	generate()
	{
		// THIS WILL GENERATE MONO CRACKLES, BUT REALLY WE WANT TO THINK ABOUT MAKING LIKE A PARTICLE GENERATOR CLASS
		// THAT SPITS OUT A RANDOM CRACKLE IN A RANDOM PAN POSITION AT A RANDOM TIME

		// loop through every frame
		for (let i = 0; i < bufferSize; i++)
			{
				// calc per sample noise
				this.noise = Math.random() * 2 - 1;

				if (this.noise > this.crackleAmount)
				{
					this.randomEnvTime = (Math.random() * 30) + 60;
					this.randomBandPassFreq = map(Math.random(), 0.0, 1.0, 1500.0, 16500.0);
					this.bandPass.setFreq(this.randomBandPassFreq / sampleRate);
					this.env.init(1, this.randomEnvTime, sampleRate);
				}
				
				this.noise = this.bandPass.process(this.noise);

				this.noise *= this.env.process(0);

				// take the high end off, to make it not sound like rain splatter
				this.noise = this.lop.process(this.noise);

				this.noise *= 0.1 * this.gain; // was also a '* 0.1' before

				// write out result (for every channel)
				for (let channel = 0; channel < numChannels; channel++)
				{
					this.data = this.buffer.getChannelData(channel);
					this.data[i] = this.noise;
				}
			} 

			return this.buffer;
		}

	}