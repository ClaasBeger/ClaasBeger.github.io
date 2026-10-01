---
layout: performance-competence-gap
title: Distinguishing Performance From Competence in Evaluations of Humanlike Abstract Reasoning
permalink: /performance-competence-gap/
description: Interactive viewer for ConceptARC model outputs and natural-language rules, comparing AI models with humans. Companion to the NeurIPS 2026 paper by Beger et al.
nav: false
---

<h1 class="paper-title">Distinguishing Performance From Competence in Evaluations of Humanlike Abstract Reasoning</h1>

<div class="paper-authors">
  <span class="author-name">Claas Beger<sup>1,*</sup></span>,
  <span class="author-name">Ryan Yi<sup>1</sup></span>,
  <span class="author-name">Shuhao Fu<sup>1</sup></span>,
  <span class="author-name">Kaleda Denton<sup>1</sup></span>,
  <span class="author-name">Arseny Moskvichev<sup>2</sup></span>,
  <span class="author-name">Sarah W. Tsai<sup>3</sup></span>,
  <span class="author-name">Sivasankaran Rajamanickam<sup>3</sup></span>,
  <span class="author-name">Melanie Mitchell<sup>1</sup></span>
</div>

<div class="paper-affiliations">
  <div><sup>1</sup> Santa Fe Institute, <sup>2</sup> Sandia National Laboratories, <sup>3</sup> Advanced Micro Devices Inc.</div>
  <div><sup>*</sup> Correspondence: <a href="mailto:claasbeger@santafe.edu">claasbeger@santafe.edu</a></div>
</div>

<div class="paper-venue">NeurIPS 2026 <span class="paper-venue-track">(Evaluations and Datasets Track)</span></div>

<div class="paper-links">
  <a href="https://arxiv.org/abs/2510.02125" target="_blank" rel="noopener noreferrer"><i class="ai ai-arxiv"></i> arXiv</a>
  <a href="https://huggingface.co/datasets/AIHumanAbstraction/ConceptARC_Rule_Annotations" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-database"></i> Data</a>
</div>

<div class="paper-abstract">
  <h2>Abstract</h2>
  <p>
    AI reasoning models have exceeded human performance on the ARC-AGI-1 benchmark, but does that mean state-of-the-art models have the underlying competence&mdash;humanlike abstract reasoning&mdash;the benchmark was designed to test? Here we investigate the abstraction abilities of AI models using the closely related but simpler ConceptARC benchmark. Our evaluations vary input modality (textual vs. visual), use of external Python tools, and reasoning effort. Beyond output accuracy, we evaluate the natural-language rules that models generate to explain their solutions, enabling us to assess whether models recognize the abstractions that ConceptARC was designed to elicit. We show that the best models' rules are frequently based on less abstract, more domain-specific concepts, capturing intended abstractions considerably less often than humans. In the visual modality, AI models' output accuracy drops sharply; however, our rule-level analysis reveals that a substantial share of their rules capture intended abstractions, even as the models struggle to apply these concepts to generate correct solutions. In short, we show that using performance (accuracy) alone can substantially overestimate AI competence in textual modalities while underestimating it in visual modalities&mdash;an illustration of the risk of mistaking performance for competence.
  </p>
</div>

<section class="findings">
<h2>Key findings</h2>
<p class="section-desc">We evaluate o3, o4-mini, Claude Sonnet 4, Gemini 2.5 Pro, GPT-4o, Llama 4 Scout and Qwen 2.5 VL 72B on the 480 tasks of ConceptARC (16 spatial and semantic concepts, 30 tasks each), with textual and visual inputs, low and medium reasoning effort, and with and without Python tools. We compare their outputs and rules with those of human participants.</p>

<div class="stat-row">
  <div class="stat-tile">
    <div class="stat-value">75.6%</div>
    <div class="stat-label">o3 accuracy with textual inputs, vs. 73% for humans</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">27%</div>
    <div class="stat-label">of o3's correct textual outputs rest on unintended or incorrect rules</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">29.2%</div>
    <div class="stat-label">o3 accuracy with visual inputs</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">28%</div>
    <div class="stat-label">of o3's incorrect visual outputs still come with a correct-intended rule</div>
  </div>
</div>
<p class="stat-note">o3 results are for medium reasoning effort with Python tools.</p>

<h3>Accuracy and rule correctness diverge</h3>
<p class="section-desc">We classify the natural-language rule behind each answer as correct-intended (it captures the intended abstraction), correct-unintended (it works on the demonstrations but is an unintended solution), or incorrect. With textual inputs, a sizeable share of the models' correct outputs come with rules that miss the intended abstraction. With visual inputs, output accuracy drops sharply, yet many incorrect outputs come with rules that do capture the intended abstraction.</p>
<figure class="paper-figure">
  <img src="{{ '/assets/performance-competence-gap/figures/rule_evaluation_by_modality.png' | relative_url }}" loading="lazy" alt="Stacked bar chart of the percentage of tasks for o3, Claude and Gemini with textual and visual inputs, and for humans, split by correct and incorrect output grid. Each bar is divided into correct-intended, correct-unintended, incorrect and not-classified rules.">
  <figcaption>Rule classification for tasks with correct and incorrect output grids, as a percentage of the 480 tasks, for o3, Claude Sonnet 4 and Gemini 2.5 Pro (medium effort, with Python tools) with textual and visual inputs, and for human participants. Rules were not collected for humans' incorrect outputs, so these are shown as not classified.</figcaption>
</figure>

<h3>Humans describe objects, models describe grids</h3>
<p class="section-desc">ConceptARC builds on core-knowledge priors such as objectness. Most human rules are phrased in terms of objects, while the models' rules more often focus on colours, individual pixels and other low-level features of the grid.</p>
<figure class="paper-figure paper-figure-narrow">
  <img src="{{ '/assets/performance-competence-gap/figures/term_proportions_with_tools.png' | relative_url }}" loading="lazy" alt="Bar chart of the proportion of rules using objectness terms and grid-specific terms. Humans: about 0.89 objectness and 0.14 grid-specific. Claude Sonnet 4, o3 and Gemini 2.5 Pro: about 0.42 to 0.53 objectness and 0.80 to 0.88 grid-specific.">
  <figcaption>Proportion of rules that use objectness terms and grid-specific terms, for humans and for Claude Sonnet 4, o3 and Gemini 2.5 Pro with Python tools.</figcaption>
</figure>

<h3>Correct outputs from unintended rules</h3>
<p class="section-desc">In each example below the model's output matches the ground truth, but its rule does not capture the intended abstraction.</p>
<div class="rule-example-tabs" role="tablist">
  <button type="button" role="tab" aria-selected="true" data-example="heuristic">Heuristic</button>
  <button type="button" role="tab" aria-selected="false" data-example="algorithmic">Algorithmic rule</button>
  <button type="button" role="tab" aria-selected="false" data-example="numerical">Numerical encoding</button>
</div>
<figure class="paper-figure rule-example" data-example="heuristic">
  <img src="{{ '/assets/performance-competence-gap/figures/rule_example_heuristic.png' | relative_url }}" loading="lazy" alt="Example task with training examples, the model's rule, the test input, and a correct model output that matches the ground truth.">
  <figcaption><strong>Heuristic.</strong> The rule picks the colour with the lowest density relative to its bounding box. Generic heuristics like bounding boxes and cell connectivity recur throughout the models' rules.</figcaption>
</figure>
<figure class="paper-figure rule-example" data-example="algorithmic" hidden>
  <img src="{{ '/assets/performance-competence-gap/figures/rule_example_algorithmic.png' | relative_url }}" loading="lazy" alt="Example task with training examples, a long step-by-step model rule, the test input, and a correct model output that matches the ground truth.">
  <figcaption><strong>Algorithmic rule.</strong> The rule is a step-by-step procedure that removes the background colour and searches for the shortest repeating period in rows and columns.</figcaption>
</figure>
<figure class="paper-figure rule-example" data-example="numerical" hidden>
  <img src="{{ '/assets/performance-competence-gap/figures/rule_example_numerical_encoding.png' | relative_url }}" loading="lazy" alt="Example task where the model's rule refers to the largest non-zero colour in the grid, with the referenced cells highlighted in the training examples and test input.">
  <figcaption><strong>Numerical encoding.</strong> The rule refers to the &ldquo;largest non-zero colour&rdquo;, relying on the numbers used to encode colours in the textual input.</figcaption>
</figure>
</section>

<section class="visualizer-section">
  <h2>Dataset viewer</h2>
  <p class="section-desc">Explore the model and human outputs and rules for each ConceptARC task.</p>
  <div id="conceptarc-visualizer"></div>
  <p class="dataset-download">
    Full data can be downloaded from
    <a href="https://huggingface.co/datasets/AIHumanAbstraction/ConceptARC_Rule_Annotations" target="_blank" rel="noopener noreferrer">AIHumanAbstraction/ConceptARC_Rule_Annotations</a>
    on Hugging Face.
  </p>
</section>

<section class="bibtex">
  <h2>BibTeX</h2>
<pre><code>@inproceedings{beger2026distinguishing,
  title     = {Distinguishing Performance From Competence in Evaluations of Humanlike Abstract Reasoning},
  author    = {Beger, Claas and Yi, Ryan and Fu, Shuhao and Denton, Kaleda and Moskvichev, Arseny and Tsai, Sarah W. and Rajamanickam, Sivasankaran and Mitchell, Melanie},
  booktitle = {Advances in Neural Information Processing Systems},
  year      = {2026}
}</code></pre>
</section>
