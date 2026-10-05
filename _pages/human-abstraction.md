---
layout: human-abstraction
title: The Challenge of Human-Like Abstraction in Contemporary AI
permalink: /human-abstraction/
description: Interactive dataset viewer for ConceptARC model and human responses.
nav: false
oneko: false
---

<h1 class="paper-title">The Challenge of Human-Like Abstraction in Contemporary AI</h1>

<div class="paper-authors">
  <span class="author-name">Melanie Mitchell<sup>a,1</sup></span>,
  <span class="author-name">Jacob G. Foster<sup>a,b,1</sup></span>,
  <span class="author-name">Claas Beger<sup>a</sup></span>,
  <span class="author-name">Ryan Yi<sup>a</sup></span>,
  <span class="author-name">Shuhao Fu<sup>a</sup></span>,
  <span class="author-name">Kaleda K. Denton<sup>a</sup></span>,
  <span class="author-name">Alessandro B. Palmarini<sup>c</sup></span>
</div>

<div class="paper-affiliations">
  <div><sup>a</sup> Santa Fe Institute, 1399 Hyde Park Road, Santa Fe, New Mexico 87501, USA</div>
  <div><sup>b</sup> Indiana University Bloomington, Department of Informatics, Cognitive Science Program, and Center for Possible Minds, 815 E 10th St, Bloomington, Indiana 47408, USA</div>
  <div><sup>c</sup> Ndea</div>
  <div><sup>1</sup> To whom correspondence should be addressed. E-mail: <a href="mailto:mm@santafe.edu">mm@santafe.edu</a>, <a href="mailto:jacobf@iu.edu">jacobf@iu.edu</a></div>
</div>

<div class="paper-links">
  <a href="https://huggingface.co/datasets/ClaasBeger/HumanLikeARCAbstraction" target="_blank" rel="noopener noreferrer"><i class="fa-solid fa-database"></i> Data</a>
</div>

<div class="paper-abstract">
  <h2>Abstract</h2>
  <p>
    Contemporary AI models have matched or exceeded human performance on many benchmarks meant to assess general human-like reasoning abilities, including the prominent Abstraction and Reasoning Corpus (ARC). However, it is often unclear whether these models achieve high accuracy by reasoning with the abstractions these benchmarks were designed to evaluate, or through other non-human-like strategies that focus on surface-level patterns. Here, we articulate cognitive-science-inspired evaluation principles to investigate the abstraction abilities of AI models and human participants. As a case study, we use ConceptARC, a benchmark in the ARC domain that assesses abstract reasoning using isolated “core-knowledge” concepts. In addition to measuring accuracy, we evaluate the natural-language rules that models and humans generate to explain their solutions, allowing us to distinguish between solutions using intended abstractions and those relying on surface-level patterns. While some models exceed human accuracy on textual versions of the tasks, their rules are substantially less likely than human-generated rules to capture intended abstractions. When given visual inputs, the accuracy of these models decreases dramatically; in numerous cases they are able to abstract a correct rule but fail to apply it to form a correct output. These findings illustrate that evaluations based on accuracy alone are not reliable indicators of a model's general capabilities, and that humans still exhibit a greater propensity for abstract reasoning than AI models. The evaluation principles we articulate can provide a more rigorous assessment of AI models' capabilities than measures based solely on accuracy.
  </p>
</div>

<div class="paper-abstract">
  <h2>Significance</h2>
  <p>
    As humans increasingly interact with and rely on artificial intelligence, it is imperative to properly evaluate AI's capabilities and limitations. Typical AI studies report only accuracy&mdash;the fraction of correct answers&mdash;on tests developed to assess particular capabilities. However, such evaluation methods can be misleading: when an AI system gets the right answers for the wrong reasons, it cannot reliably generalize. Here, we articulate evaluation principles for more deeply assessing general capacities in humans and machines. Adopting these principles to investigate abstract reasoning abilities in state-of-the-art AI models, we find that previous evaluations have overestimated these models' ability to form concepts and reason in a human-like way. Such systems are still missing core capabilities underlying human intelligence.
  </p>
</div>

<section class="findings">
<h2>Evaluation principles from cognitive science</h2>
<p class="section-desc">We adopt three principles that cognitive scientists have proposed for evaluating cognitive capacities in AI systems.</p>
<div class="principle-row">
  <div class="principle">
    <h3>Test for robustness, not only accuracy</h3>
    <p>Test the same conceptual abstraction across multiple tasks and measures, so that success depends on the general capacity rather than on properties of particular stimuli.</p>
  </div>
  <div class="principle">
    <h3>Investigate possible shortcuts</h3>
    <p>Consider alternative strategies a model might use to reach the correct answer, and design controls that tell these strategies apart.</p>
  </div>
  <div class="principle">
    <h3>Separate performance from competence</h3>
    <p>Success in a limited setting can overstate a general capacity, while system-specific limitations, such as perception, can understate it.</p>
  </div>
</div>

<h2>ConceptARC</h2>
<p class="section-desc">ConceptARC contains 480 tasks in the ARC domain, each focused on one of 16 basic spatial and semantic concepts such as &ldquo;inside and outside&rdquo;, &ldquo;above and below&rdquo; and &ldquo;same vs. different&rdquo;, with 30 tasks per concept. The tasks are designed to be easy for humans, so they test whether a solver grasps the concept rather than how hard the puzzle is.</p>
<div class="paper-figure">
  {% include figure.liquid path="assets/conceptarc/figures/conceptarc_example_tasks.png" avoid_scaling=true zoomable=true loading="lazy" alt="Four example ConceptARC tasks, each with input and output demonstration grids and a test input." caption="Sample tasks from the ConceptARC dataset. Task 1 has three demonstrations and a test grid; tasks 2 to 4 each have two demonstrations and a test grid." %}
</div>

<h2>Key findings</h2>
<p class="section-desc">We evaluated o3, Claude Sonnet 4 and Gemini 2.5 Pro with textual and visual inputs, and compared their output grids and the natural-language rules they stated with those of human participants.</p>
<div class="stat-row">
  <div class="stat-tile">
    <div class="stat-value">77.1%</div>
    <div class="stat-label">o3 accuracy with textual inputs, vs. 73.0% for humans</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">~32%</div>
    <div class="stat-label">of o3's correct textual outputs rest on unintended or incorrect rules, vs. 7% for humans</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">&le;5.6%</div>
    <div class="stat-label">accuracy of every model with visual inputs</div>
  </div>
  <div class="stat-tile">
    <div class="stat-value">~29%</div>
    <div class="stat-label">of o3's incorrect visual outputs still come with a correct-intended rule</div>
  </div>
</div>

<h3>Output-grid accuracy</h3>
<table class="results-table">
  <thead>
    <tr><th>Model</th><th>Textual</th><th>Visual</th></tr>
  </thead>
  <tbody>
    <tr><td>o3</td><td>77.1</td><td>5.6</td></tr>
    <tr><td>Claude Sonnet 4</td><td>60.2</td><td>5.2</td></tr>
    <tr><td>Gemini 2.5 Pro</td><td>66.0</td><td>4.2</td></tr>
    <tr><td>Humans</td><td>N/A</td><td>73.0</td></tr>
  </tbody>
</table>
<p class="stat-note">Pass@1 accuracy (%) on the 480 ConceptARC tasks. Humans were tested only with visual inputs.</p>

<h3>Accuracy overstates competence with textual inputs and understates it with visual inputs</h3>
<p class="section-desc">Each rule was classified as correct-intended (it captures the intended abstraction), correct-unintended (it works on the demonstrations but relies on unintended features) or incorrect. With textual inputs, a sizeable share of the models' correct outputs rest on rules that miss the intended abstraction. With visual inputs, the models often state the intended rule but fail to apply it.</p>
<div class="paper-figure">
  {% include figure.liquid path="assets/conceptarc/figures/rule_evaluation.png" avoid_scaling=true zoomable=true loading="lazy" alt="Stacked bar chart of rule classifications for correct and incorrect output grids, for o3, Claude and Gemini with textual and visual inputs, and for humans." caption="Rule evaluation results. For each model in each modality, and for humans, two bars show the percentages of correct and incorrect grid outputs over the 480 tasks, split into correct-intended (green), correct-unintended (yellow) and incorrect (red) rules. Gray segments are rules that could not be classified." %}
</div>

<h3>Humans describe objects, models describe grids</h3>
<p class="section-desc">ConceptARC builds on core-knowledge concepts such as objectness. Human rules mostly refer to objects, while the models' rules mostly refer to individual cells, rows, columns and other low-level features of the grid.</p>
<div class="paper-figure paper-figure-narrow">
  {% include figure.liquid path="assets/conceptarc/figures/objectness_terms.png" avoid_scaling=true zoomable=true loading="lazy" alt="Bar chart of the proportion of rules using objectness terms and grid-specific terms, for humans, Claude Sonnet 4, o3 and Gemini 2.5 Pro." caption="Proportion of rules that contain at least one objectness term (object, shape, square, rectangle, line, ...) or grid-specific term (cell, pixel, row, column, value, ...), for humans (2,456 rules), Claude Sonnet 4 (278), o3 (370) and Gemini 2.5 Pro (317), based on rules for correct outputs with textual inputs." %}
</div>
</section>

<section class="visualizer-section">
  <h2>Dataset viewer</h2>
  <p class="section-desc">Use this viewer to investigate model and human responses on the ConceptARC tasks.</p>
  <div id="conceptarc-visualizer"></div>
  <p class="dataset-download">
    Full data can be downloaded from
    <a href="https://huggingface.co/datasets/ClaasBeger/HumanLikeARCAbstraction" target="_blank" rel="noopener noreferrer">ClaasBeger/HumanLikeARCAbstraction</a>
    on Hugging Face.
  </p>
</section>
