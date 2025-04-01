---
layout: page
title: SpikeDecoder
description: Bachelor's thesis exploring Spiking Neural Networks
img: assets/img/Decoder_Architecture-LN_layers-1.png
importance: 1
category: research
---

## SpikeDecoder: Exploring Brain-Inspired Neural Networks

I developed SpikeDecoder as part of my Bachelor's thesis, focusing on a research topic that has fascinated me since before I started university: the relationship between artificial intelligence and biological neural processing.

### Project Overview

While modern AI systems like ChatGPT and other GPT architectures demonstrate impressive capabilities, they operate quite differently from biological neurons. My research explored Spiking Neural Networks (SNNs) as an alternative approach that more closely mimics how the brain processes information.

### What are Spiking Neural Networks?

Spiking Neural Networks replicate the "all-or-nothing" behavior of biological neurons. In the brain, neurons integrate charges they receive from previous neurons, then release transmitters in the intersynaptic cleft once a threshold is reached, exciting adjacent neurons. This binary spiking behavior can be implemented very energy-efficiently using neuromorphic hardware.

Unlike traditional neural networks that use continuous values, SNNs propagate information through discrete spikes - either through the rate of spikes or their precise timing. This constraint creates interesting challenges and opportunities.

<div class="row">
    <div class="col-sm mt-3 mt-md-0">
        {% include figure.liquid loading="eager" path="assets/img/Decoder_Architecture-LN_layers-1.png" title="SpikeDecoder Architecture" class="img-fluid rounded z-depth-1" %}
    </div>
</div>
<div class="caption">
    The architecture of the SpikeDecoder system, illustrating how information flows through the spiking neural network.
</div>

### Research Contributions

My implementation focused on creating architectures similar to transformers but using spiking neurons. While SNNs typically deliver weaker overall performance compared to traditional neural networks, the energy efficiency and biological plausibility make any performance gains significant contributions to the field.

This research area remains relatively new, with substantial opportunities for further exploration and optimization.

If you're interested in exploring the implementation details or experimenting with the code, visit the [SpikeDecoder repository on GitHub](https://github.com/ClaasBeger/SpikeDecoder).