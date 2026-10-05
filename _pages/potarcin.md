---
layout: potarcin
title: "PotARCin: Multi-Dimensional Evaluation of Skill Acquisition in Abstract Reasoning Tasks"
permalink: /potarcin/
description: PotARCin evaluates whether AI models acquire the rule behind an ARC task across five dimensions, and introduces the P-ARC test set. NeurIPS 2026, Evaluations and Datasets Track.
nav: false
oneko: false
---

<h1 class="paper-title">PotARCin: Multi-Dimensional Evaluation of Skill Acquisition in Abstract Reasoning Tasks</h1>

<div class="paper-authors">
  <span class="author-name">Claas Beger</span>,
  <span class="author-name">Ryan Yi</span>,
  <span class="author-name">Melanie Mitchell</span>
</div>

<div class="paper-affiliations">
  <div>Santa Fe Institute</div>
  <div>Correspondence: <a href="mailto:claasbeger@santafe.edu">claasbeger@santafe.edu</a></div>
</div>

<div class="paper-venue">NeurIPS 2026 <span class="paper-venue-track">(Evaluations and Datasets Track)</span></div>

<div class="paper-links">
  <a href="https://arxiv.org/abs/2609.27288" target="_blank" rel="noopener noreferrer"><i class="ai ai-arxiv"></i> arXiv</a>
  <a href="https://huggingface.co/datasets/ClaasBeger/P-ARC" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-database"></i> P-ARC dataset</a>
</div>

<div class="paper-abstract">
  <h2>Abstract</h2>
  <p>
    The Abstraction and Reasoning Corpus (ARC) has become a prominent benchmark for evaluating general abstract reasoning and fluid intelligence in AI models. Yet standard ARC evaluation considers only a single capability: producing the correct output grid for a test input. We argue that this narrow format fails to evaluate the diversity of abilities that genuine abstract skill acquisition should enable. We introduce PotARCin, a benchmark that extends ARC by assessing understanding of a task's underlying abstract rule across five dimensions: Definition, Classification, Constrained Generation, Editing, and Inversion. PotARCin employs programmatic methods to generate new task instances and transform given inputs for a given ARC task, enabling dynamic generative sampling beyond fixed input-output pairs. Across five state-of-the-art models evaluated on the ARC-AGI-1 training set, we observe a 25&ndash;52 percentage-point performance gap between standard ARC evaluation and evaluation on PotARCin, and find that multi-dimensional evaluation reorders models that standard accuracy ranks alike. We further investigate effects of generative sampling, difficulty of corruption types, and questions of self-consistency, showing that models frequently contradict their own formalized rule even where they have stated it correctly. We also introduce P-ARC, a held-out hand-crafted test set, on which models achieve 1&ndash;8% accuracy across all five dimensions, underscoring the importance of more holistic evaluations of abstract reasoning capabilities.
  </p>
</div>

<section class="findings">
<h2>Five uses of the same rule</h2>
<p class="section-desc">Each ARC task defines a small skill: inferring and using the rule behind its demonstrations. Standard ARC evaluation tests one use of it, transforming a test input. PotARCin presents the same demonstrations and asks for four more, all scored automatically with task-specific generator and verifier programs.</p>

<div class="paper-figure">
  {% include figure.liquid path="assets/potarcin/figures/overview.png" avoid_scaling=true zoomable=true loading="lazy" alt="Diagram of the five PotARCin dimensions around the standard ARC task: Definition, Classification, Constrained Generation, Editing and Inversion, each illustrated on the same ARC task." caption="Overview of PotARCin on ARC-AGI-1 task 890034e9, for which GPT-5.4 solved the standard test-grid task but failed all five additional dimensions." %}
</div>

<div class="principle-row dims-row">
  <div class="principle">
    <h3>Definition</h3>
    <p>Write a Python program implementing the rule, checked on the demonstrations, the test input and hundreds of generated examples.</p>
  </div>
  <div class="principle">
    <h3>Classification</h3>
    <p>Decide for five candidate pairs whether each follows the rule; candidates mix valid examples with plausible corruptions.</p>
  </div>
  <div class="principle">
    <h3>Constrained generation</h3>
    <p>Produce a new valid input&ndash;output pair that differs from the demonstrations.</p>
  </div>
  <div class="principle">
    <h3>Editing</h3>
    <p>Repair a corrupted pair so that it follows the rule again, while staying close to it.</p>
  </div>
  <div class="principle">
    <h3>Inversion</h3>
    <p>Given an output grid, produce an input that the rule maps to it.</p>
  </div>
</div>

<h2>Key findings</h2>
<p class="section-desc">We evaluated GPT-5.4, Gemini 3.1 Pro, Claude Opus 4.6, Kimi K2.5 and MiniMax M2.5 on the 400 ARC-AGI-1 training tasks and on P-ARC, with two independent runs each. A task counts as fully solved only if all five dimensions are correct.</p>
<div class="stat-row">
  <div class="stat-tile">
    <div class="stat-value">25&ndash;52 pts</div>
    <div class="stat-label">drop from output-grid accuracy (63&ndash;89%) to full-task accuracy (21&ndash;58%) on ARC-AGI-1</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">1&ndash;8%</div>
    <div class="stat-label">full-task accuracy of every model on the held-out P-ARC tasks</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">21.1%</div>
    <div class="stat-label">of wrong answers agree with the model's own correct program, vs. 99.1% of right ones</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">15 of 20</div>
    <div class="stat-label">fully solved tasks fail at least one of 10 resampled instances (GPT-5.4)</div>
  </div>
</div>

<h3>Output accuracy does not reflect rule competence</h3>
<p class="section-desc">Definition and Classification are the hardest dimensions and Inversion the easiest. Multi-dimensional evaluation also separates models that output-grid accuracy ranks alike: Kimi K2.5 has the lowest output-grid accuracy of the five models, yet nearly doubles MiniMax M2.5's full-task accuracy (38.6% vs. 20.6%). On P-ARC, every level drops sharply.</p>
<div class="paper-figure">
  {% include figure.liquid path="assets/potarcin/figures/performance.png" avoid_scaling=true zoomable=true loading="lazy" alt="Grouped bar charts for ARC-AGI-1 and P-ARC showing output-grid accuracy, accuracy on each of the five PotARCin dimensions, and full-task accuracy for five models." caption="Performance on the standard output-grid task, each PotARCin dimension, and all five together, for 400 ARC-AGI-1 training tasks and 50 P-ARC tasks, pooled over two runs. Whiskers are 95% Wilson intervals." %}
</div>

<h3>Models contradict rules they have stated correctly</h3>
<p class="section-desc">Because Definition yields an executable program, we can check the model's other answers against its own program. Where that program is correct and the other answer is right, the two agree 99.1% of the time on ARC-AGI-1. Where the other answer is wrong, agreement falls to 21.1% (17.1% on P-ARC): most mistakes are not consequences of a wrong rule, but failures to apply a rule the model has already formalized.</p>

<h3>Single samples overestimate robustness</h3>
<p class="section-desc">For 20 tasks that GPT-5.4 initially solved in all five dimensions, we sampled 10 new instances per dimension. On 15 of them it fails at least one instance, mostly within the first two additional samples. Probing five different dimensions also exposes more failures than repeating one dimension five times (25.5% vs. 20.2% of trials).</p>
<div class="paper-figure paper-figure-narrow">
  {% include figure.liquid path="assets/potarcin/figures/sampling_budget.png" avoid_scaling=true zoomable=true loading="lazy" alt="Line chart of accuracy against the number of additional samples for each dimension and for average and hard full-task accuracy, for GPT-5.4 on 20 tasks." caption="Accuracy of GPT-5.4 as more instances are sampled for 20 ARC-AGI-1 tasks it initially solved in all five dimensions. Hard full-task accuracy counts tasks that pass every sampled instance so far." %}
</div>

<h2>P-ARC</h2>
<p class="section-desc">P-ARC is a held-out set of 50 hand-crafted ARC-style tasks, which we estimate to lie between ARC-AGI-1 and ARC-AGI-2 in difficulty. Each task comes with a generator and a verifier program, 50 fixed generated examples, three erroneous human attempts used as corruptions, and a reviewed natural-language rule. The dataset is available on <a href="https://huggingface.co/datasets/ClaasBeger/P-ARC" target="_blank" rel="noopener noreferrer">Hugging Face</a> under the MIT license. Four of its tasks:</p>

{% include potarcin_parc_gallery.html %}
</section>

<section class="bibtex">
  <h2>BibTeX</h2>
<pre><code>@inproceedings{beger2026potarcin,
  title         = {PotARCin: Multi-Dimensional Evaluation of Skill Acquisition in Abstract Reasoning Tasks},
  author        = {Beger, Claas and Yi, Ryan and Mitchell, Melanie},
  booktitle     = {Advances in Neural Information Processing Systems},
  year          = {2026},
  eprint        = {2609.27288},
  archivePrefix = {arXiv}
}</code></pre>
</section>
