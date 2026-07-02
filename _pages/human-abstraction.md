---
layout: human-abstraction
title: The Challenge of Human-Like Abstraction in Contemporary AI
permalink: /human-abstraction/
description: Interactive dataset viewer for ConceptARC model and human responses.
nav: false
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
  <div><sup>1</sup> Equal contribution</div>
</div>

<div class="paper-abstract">
  <h2>Abstract</h2>
  <p>
    Contemporary AI models have matched or exceeded human performance on many benchmarks meant to assess general human-like reasoning abilities, including the prominent Abstraction and Reasoning Corpus (ARC). However, it is often unclear whether these models achieve high accuracy by reasoning with the abstractions these benchmarks were designed to evaluate, or through other non-human-like strategies that focus on surface-level patterns. Here, we articulate cognitive-science-inspired evaluation principles to investigate the abstraction abilities of AI models and human participants. As a case study, we use ConceptARC, a benchmark in the ARC domain that assesses abstract reasoning using isolated “core-knowledge” concepts. In addition to measuring accuracy, we evaluate the natural-language rules that models and humans generate to explain their solutions, allowing us to distinguish between solutions using intended abstractions and those relying on surface-level patterns. While some models exceed human accuracy on textual versions of the tasks, their rules are substantially less likely than human-generated rules to capture intended abstractions. When given visual inputs, the accuracy of these models decreases dramatically; in numerous cases they are able to abstract a correct rule but fail to apply it to form a correct output. These findings illustrate that evaluations based on accuracy alone are not reliable indicators of a model's general capabilities, and that humans still exhibit a greater propensity for abstract reasoning than AI models. The evaluation principles we articulate can provide a more rigorous assessment of AI models' capabilities than measures based solely on accuracy.
  </p>
</div>

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
