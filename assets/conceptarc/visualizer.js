/**
 * Web-based ConceptARC Visualizer
 * Adapted from the Python Visualizer.py for web embedding
 */

class ConceptARCVisualizer {
    constructor(containerId, options = {}) {
        this.container = document.getElementById(containerId);
        this.options = {
            cellSize: 30,
            maxCellSize: 60,
            minCellSize: 8,
            dataRoot: '',
            ...options
        };
        this.dataRoot = this.options.dataRoot.replace(/\/$/, '');
        
        // ARC color palette (matching Python version)
        this.colors = {
            0: [0, 0, 0],        // Black
            1: [0, 105, 207],    // Blue
            2: [255, 57, 55],    // Red
            3: [0, 197, 67],     // Green
            4: [255, 215, 49],   // Yellow
            5: [160, 160, 160],  // Gray
            6: [249, 22, 179],   // Pink
            7: [255, 122, 44],   // Orange
            8: [99, 214, 252],   // Light Blue
            9: [130, 15, 35],    // Dark Red
            10: [255, 255, 255]  // White
        };
        
        this.data = null;
        this.currentPuzzle = null;
        this.currentTest = null;
        this.currentHuman = null;
        this.isHumanMode = false;
        
        this.init();
    }

    dataPath(relativePath) {
        const path = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
        return this.dataRoot ? `${this.dataRoot}${path}` : path;
    }
    
    init() {
        this.createUI();
        this.bindEvents();
        // Initialize setting options and concept list from current selectors
        this.refreshSettingOptions();
        this.populateConceptsFromSelectors();
    }
    
    createUI() {
        this.container.innerHTML = `
            <div class="visualizer-container">
                <!-- Control Bar -->
                <div class="control-bar">
                    <div class="controls-left">
                        <label>Modality:</label>
                        <select id="modality-select">
                            <option value="Textual">Textual</option>
                            <option value="Visual">Visual</option>
                        </select>
                        <label>Model:</label>
                        <select id="model-select">
                            <option value="o3">o3</option>
                            <option value="claude-sonnet-4">Claude</option>
                            <option value="gemini-2.5-pro">Gemini</option>
                            <option value="Human">Human</option>
                        </select>
                        <select id="setting-select" hidden aria-hidden="true">
                            <option value="medium" selected>medium</option>
                        </select>
                        <label id="static-concept-label">Concept:</label>
                        <select id="static-concept-select"></select>
                        <button id="load-dataset-btn" class="btn btn-primary">📥 Load</button>
                        
                        <!-- Standard Mode Controls -->
                        <div id="standard-controls" class="nav-controls">
                            <label>Puzzle:</label>
                            <select id="puzzle-select"></select>
                            <label>Test:</label>
                            <select id="test-select"></select>
                            <button id="prev-btn" class="btn btn-secondary">◀</button>
                            <button id="next-btn" class="btn btn-secondary">▶</button>
                        </div>
                        
                        <!-- Human Mode Controls -->
                        <div id="human-controls" class="nav-controls" style="display: none;">
                            <label>Concept:</label>
                            <select id="concept-select"></select>
                            <label>Puzzle:</label>
                            <select id="human-puzzle-select"></select>
                            <label>Test:</label>
                            <select id="human-test-select"></select>
                            <label>Human:</label>
                            <select id="human-select"></select>
                            <button id="human-prev-btn" class="btn btn-secondary">◀</button>
                            <button id="human-next-btn" class="btn btn-secondary">▶</button>
                        </div>
                        
                        <div id="performance-indicator" class="performance-indicator">Performance: --</div>
                    </div>
                    <div class="controls-right">
                        <div id="status" class="status">No file loaded</div>
                    </div>
                </div>
                
                <!-- Main Content -->
                <div class="main-content">
                    <!-- Left Panel -->
                    <div class="left-panel">
                        <!-- Standard Mode Left Panels -->
                        <div id="standard-left-panels">
                            <div class="panel">
                                <h3>Model Rule</h3>
                                <div id="model-rule-content" class="text-content"></div>
                            </div>
                            <div class="panel">
                                <h3>Ground Truth Rule</h3>
                                <div id="gt-rule-content" class="text-content"></div>
                            </div>
                            <div class="panel">
                                <h3>Rule Status</h3>
                                <div id="rule-status-panel" class="rule-status-panel">
                                    <div id="rule-status-content" class="rule-status-content"></div>
                                </div>
                            </div>
                            
                            <div class="panel">
                                <h3>Model Reasoning</h3>
                                <div id="reasoning-content" class="text-content"></div>
                            </div>
                        </div>
                        
                        <!-- Human Mode Left Panels -->
                        <div id="human-left-panels" style="display: none;">
                            <div class="panel">
                                <h3>Human Rule</h3>
                                <div id="human-rule-content" class="text-content"></div>
                            </div>
                            <div class="panel">
                                <h3>Ground Truth Rule</h3>
                                <div id="human-gt-rule-content" class="text-content"></div>
                            </div>
                            <div class="panel">
                                <h3>Rule Status</h3>
                                <div id="human-rule-status-panel" class="rule-status-panel">
                                    <div id="human-rule-status-content" class="rule-status-content"></div>
                                </div>
                            </div>
                            
                            <div class="panel">
                                <h3>Test Input</h3>
                                <div id="human-test-grid" class="grid-container"></div>
                            </div>
                        </div>
                    </div>
                    
                    <!-- Right Panel -->
                    <div class="right-panel">
                        <!-- Standard Mode Right Panels -->
                        <div id="standard-right-panels">
                            <div class="panel">
                                <h3>Training Demonstrations</h3>
                                <div id="demos-container" class="demos-container"></div>
                            </div>
                            <div class="panel">
                                <h3>Test Input</h3>
                                <div id="test-grid" class="grid-container"></div>
                            </div>
                            <div class="grids-row">
                                <div class="panel">
                                    <h3>Ground Truth</h3>
                                    <div id="gt-grid" class="grid-container"></div>
                                </div>
                                <div class="panel">
                                    <h3>Model Answer</h3>
                                    <div id="answer-grid" class="grid-container"></div>
                                </div>
                            </div>
                        </div>
                        
                        <!-- Human Mode Right Panels -->
                        <div id="human-right-panels" style="display: none;">
                            <div class="panel">
                                <h3>Training Demonstrations</h3>
                                <div id="human-demos-container" class="demos-container"></div>
                            </div>
                            <div class="panel">
                                <h3>Ground Truth</h3>
                                <div id="human-gt-grid" class="grid-container"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }
    
    bindEvents() {
        // Static dataset loading (no uploads)
        document.getElementById('load-dataset-btn').addEventListener('click', async () => {
            await this.loadFromSelectors();
        });
        document.getElementById('modality-select').addEventListener('change', async () => {
            this.refreshSettingOptions();
            await this.populateConceptsFromSelectors();
            const modelNow = document.getElementById('model-select').value;
            this.isHumanMode = (modelNow === 'Human') ? true : this.isHumanMode;
            this.updateModeVisibility();
            // Auto-load dataset when switching modality
            if (modelNow === 'Human') {
                const concept = this._humanSelectedConcept || (this._humanConceptsCache && this._humanConceptsCache[0]) || 'AboveBelow';
                await this.loadStaticConceptDataset(this.dataPath('/data/logs/Human'), concept);
            } else {
                const base = this.resolveBasePathFromSelectors();
                const conceptSel = document.getElementById('static-concept-select');
                const concept = conceptSel && conceptSel.value;
                if (base && concept) await this.loadStaticConceptDataset(base, concept);
            }
        });
        document.getElementById('model-select').addEventListener('change', async () => {
            this.refreshSettingOptions();
            const modelNow = document.getElementById('model-select').value;
            this.isHumanMode = (modelNow === 'Human');
            this.updateModeVisibility();
            await this.populateConceptsFromSelectors();
            // Auto-load dataset on model switch
            if (modelNow === 'Human') {
                const concept = this._humanSelectedConcept || (this._humanConceptsCache && this._humanConceptsCache[0]) || 'AboveBelow';
                await this.loadStaticConceptDataset(this.dataPath('/data/logs/Human'), concept);
            } else {
                const base = this.resolveBasePathFromSelectors();
                const conceptSel = document.getElementById('static-concept-select');
                const concept = conceptSel && conceptSel.value;
                if (base && concept) await this.loadStaticConceptDataset(base, concept);
            }
        });
        document.getElementById('setting-select').addEventListener('change', async () => {
            await this.populateConceptsFromSelectors();
            const modelNow = document.getElementById('model-select').value;
            this.isHumanMode = (modelNow === 'Human') ? true : this.isHumanMode;
            this.updateModeVisibility();
            // Auto-load dataset when switching setting
            if (modelNow === 'Human') {
                const concept = this._humanSelectedConcept || (this._humanConceptsCache && this._humanConceptsCache[0]) || 'AboveBelow';
                await this.loadStaticConceptDataset(this.dataPath('/data/logs/Human'), concept);
            } else {
                const base = this.resolveBasePathFromSelectors();
                const conceptSel = document.getElementById('static-concept-select');
                const concept = conceptSel && conceptSel.value;
                if (base && concept) await this.loadStaticConceptDataset(base, concept);
            }
        });
        
        // Navigation
        document.getElementById('prev-btn').addEventListener('click', () => this.navigateLeft());
        document.getElementById('next-btn').addEventListener('click', () => this.navigateRight());
        
        document.getElementById('human-prev-btn').addEventListener('click', () => this.navigateLeft());
        document.getElementById('human-next-btn').addEventListener('click', () => this.navigateRight());
        
        // Dropdown changes
        document.getElementById('puzzle-select').addEventListener('change', () => this.updateTests());
        document.getElementById('test-select').addEventListener('change', () => this.refresh());
        // Ensure when puzzle changes, we also refresh after setting test
        document.getElementById('puzzle-select').addEventListener('change', () => {
            this.updateTests();
            this.refresh();
            this.updatePerformanceIndicator();
        });
        
        document.getElementById('concept-select').addEventListener('change', async () => {
            const modelNow = document.getElementById('model-select').value;
            if (modelNow === 'Human') {
                const selConcept = document.getElementById('concept-select').value;
                // Remember desired human concept so navigation doesn't reset it
                this._humanSelectedConcept = selConcept;
                // Load the selected human concept dataset so dropdown becomes a true concept switcher
                await this.loadStaticConceptDataset(this.dataPath('/data/logs/Human'), selConcept);
            } else {
                this.updateHumanPuzzles();
            }
        });
        document.getElementById('human-puzzle-select').addEventListener('change', () => this.updateHumanTests());
        document.getElementById('human-test-select').addEventListener('change', () => this.updateHumans());
        document.getElementById('human-select').addEventListener('change', () => this.refresh());
        
        // No validation buttons needed for read-only viewer
    }
    
    async loadCSV(file) {
        if (!file) {
            console.log('No file selected');
            return;
        }
        
        console.log('Loading file:', file.name, 'Size:', file.size);
        
        try {
            const text = await file.text();
            console.log('File content length:', text.length);
            console.log('First 500 characters:', text.substring(0, 500));
            
            const rows = this.parseCSV(text);
            console.log('Parsed rows:', rows.length);
            console.log('First row keys:', Object.keys(rows[0] || {}));
            console.log('First row:', rows[0]);
            
            // Test specific fields
            if (rows.length > 0) {
                console.log('Sample puzzle values:', rows.slice(0, 3).map(r => r.puzzle));
                console.log('Sample test_idx values:', rows.slice(0, 3).map(r => r.test_idx));
            }
            
            // Detect if this is human data
            this.isHumanMode = this.detectHumanData(rows);
            console.log('Human mode:', this.isHumanMode);
            
            if (rows.length === 0) {
                console.warn('No rows parsed from CSV');
                this.updateStatus(`❌ Failed to parse CSV rows`, 'error');
                return;
            }
            // Keep original rows but do not mutate; store headers for flexible mapping
            this.data = rows;
            this._headers = Object.keys(rows[0] || {});
            this.updateStatus(`✅ Loaded ${rows.length} rows from ${file.name}`);
            
            this.setupNavigation();
            this.refresh();
            this.updatePerformanceIndicator();
        } catch (error) {
            console.error('Error loading CSV:', error);
            this.updateStatus(`❌ Failed to load file: ${error.message}`);
        }
    }

    async loadPuzzleDirectory(fileList) {
        try {
            this.updateStatus('⏳ Loading puzzles...');
            if (!this.puzzlesByPuzzleName) {
                this.puzzlesByPuzzleName = {};
                this.puzzlesByConceptAndName = {};
            }
            let loaded = 0;
            for (const file of fileList) {
                if (!file.name.toLowerCase().endsWith('.json')) continue;
                try {
                    const text = await file.text();
                    const data = JSON.parse(text);
                    const base = file.name.replace(/\.json$/i, '');
                    const rel = file.webkitRelativePath || file.name;
                    const parts = rel.split('/');
                    let concept = '';
                    if (parts.length >= 2) {
                        concept = parts[parts.length - 2];
                    }
                    this.puzzlesByPuzzleName[base] = data;
                    if (concept) {
                        this.puzzlesByConceptAndName[`${concept}/${base}`] = data;
                    }
                    loaded++;
                } catch (err) {
                    console.warn('Failed to load puzzle JSON:', file.name, err);
                }
            }
            this.hasPuzzleData = loaded > 0;
            if (this.hasPuzzleData) {
                this.updateStatus(`✅ Loaded ${loaded} puzzles`);
                if (this.data && this.data.length) {
                    this.refresh();
                }
            } else {
                this.updateStatus('❌ No puzzle JSON files found');
            }
        } catch (e) {
            console.error('Error loading puzzle directory:', e);
            this.updateStatus('❌ Failed to load puzzles');
        }
    }
    
    parseCSV(text) {
        try {
            // Normalize newlines and curly quotes → straight quotes
            const normalized = String(text)
                .replace(/\r\n/g, '\n').replace(/\r/g, '\n')
                .replace(/[\u201C\u201D]/g,'"');
            // Split file into rows while respecting quotes
            const rowsRaw = [];
            let inQuotes = false;
            let buf = '';
            for (let i = 0; i < normalized.length; i++) {
                const ch = normalized[i];
                const next = i + 1 < normalized.length ? normalized[i + 1] : '';
                if (ch === '"') {
                    if (inQuotes && next === '"') { buf += '"'; i++; }
                    else { inQuotes = !inQuotes; }
                } else if (ch === '\n' && !inQuotes) {
                    rowsRaw.push(buf);
                    buf = '';
                } else {
                    buf += ch;
                }
            }
            if (buf.trim().length) rowsRaw.push(buf);
            const nonEmpty = rowsRaw.filter(r => r.trim().length);
            if (nonEmpty.length < 2) return [];
            const header = this.parseCSVRow(nonEmpty[0]);
            const out = [];
            for (let i = 1; i < nonEmpty.length; i++) {
                let vals = this.parseCSVRow(nonEmpty[i]);
                if (!vals.length) continue;
                // Heuristic repair: if too many fields due to unquoted commas, merge into long-text columns in order
                if (vals.length > header.length) {
                    const idxRule    = header.findIndex(h => /^rule$/i.test(h));
                    const idxSummary = header.findIndex(h => /^summary$/i.test(h));
                    const idxReason  = header.findIndex(h => /^rule_evaluation_reasoning$/i.test(h));
                    const mergeTargets = [idxRule, idxSummary, idxReason].filter(i => i !== -1);
                    for (const t of mergeTargets) {
                        while (vals.length > header.length && t >= 0 && t < vals.length - 1) {
                            vals[t] = vals[t] + ',' + vals[t+1];
                            vals.splice(t+1, 1);
                        }
                        if (vals.length === header.length) break;
                    }
                    // If still longer, merge all trailing extras into the last header column
                    if (vals.length > header.length) {
                        const lastIdx = Math.min(header.length - 1, vals.length - 1);
                        while (vals.length > header.length) {
                            vals[lastIdx] = vals[lastIdx] + ',' + vals[lastIdx + 1];
                            vals.splice(lastIdx + 1, 1);
                        }
                    }
                }
                const row = {};
                for (let j = 0; j < header.length; j++) {
                    const key = header[j];
                    row[key] = (typeof vals[j] !== 'undefined') ? vals[j] : '';
                }
                out.push(row);
            }
            return out;
        } catch (e) {
            console.error('CSV parsing error:', e);
            return [];
        }
    }

    // ---------- Flexible field accessors ----------
    getPuzzleFromRow(row) {
        if (!row) return '';
        if (row.puzzle && row.puzzle.trim()) {
            const p = row.puzzle.trim();
            // If puzzle is only a concept (no trailing digits), prefer Task stem when available
            if (!/\d+$/.test(p)) {
                const task = row.Task || row.task || '';
                if (task) {
                    const parts = String(task).split('/');
                    const last = parts[parts.length - 1] || '';
                    const stem = last.replace(/\.json$/i, '').trim();
                    if (stem) return stem;
                }
            }
            return p;
        }
        const task = row.Task || row.task || '';
        if (task) {
            // strip directories and .json
            const parts = String(task).split('/');
            const last = parts[parts.length - 1] || '';
            return last.replace(/\.json$/i, '').trim();
        }
        return '';
    }

    getTestIdxFromRow(row) {
        if (!row) return '';
        const cands = [row.test_idx, row.Test, row.test, row.testId, row.test_id];
        for (const v of cands) {
            if (typeof v !== 'undefined' && String(v).trim() !== '') return String(v).trim();
        }
        return '';
    }

    getConceptFromRow(row, puzzleName) {
        const c = (row && (row.concept || row.Concept)) ? (row.concept || row.Concept) : '';
        if (c) return String(c).trim();
        const p = puzzleName || this.getPuzzleFromRow(row);
        return p ? p.replace(/\d+$/, '') : '';
    }

    getModelRuleFromRow(row) {
        // Strict: Model Rule is exactly the 'Rule' column
        const v = row && typeof row.Rule !== 'undefined' ? String(row.Rule).trim() : '';
        return v;
    }

    getSummaryFromRow(row) {
        const cands = [row.summary, row.Summary, row.reasoning, row.Reasoning];
        for (const v of cands) {
            if (typeof v !== 'undefined' && String(v).trim() !== '') return String(v);
        }
        return '';
    }
    
    parseCSVSimple(text) {
        console.log('Using advanced CSV parser for multi-line fields...');
        
        // Find the header line
        const lines = text.split('\n');
        let headerLine = '';
        let headerIndex = 0;
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line && line.startsWith('timestamp,') && line.includes('concept,puzzle,test_idx')) {
                headerLine = line;
                headerIndex = i;
                break;
            }
        }
        
        if (!headerLine) {
            console.error('No valid header line found');
            return [];
        }
        
        console.log('Header line found at index:', headerIndex);
        const headers = this.simpleCSVSplit(headerLine);
        console.log('Headers:', headers);
        console.log('Header count:', headers.length);
        
        // Now parse the CSV properly by reconstructing complete rows
        const rows = [];
        let currentRow = '';
        let inQuotes = false;
        let rowStartIndex = headerIndex + 1;
        
        for (let i = rowStartIndex; i < lines.length; i++) {
            const line = lines[i];
            
            // Skip empty lines and markdown
            if (!line.trim() || line.trim().startsWith('**') || line.trim().startsWith('#')) {
                continue;
            }
            
            // Check if this line starts a new data row (starts with timestamp)
            if (line.match(/^\d{4}-\d{2}-\d{2}T/)) {
                // If we have a previous row, process it
                if (currentRow.trim()) {
                    this.processCompleteRow(currentRow, headers, rows);
                }
                // Start new row
                currentRow = line;
                inQuotes = false;
            } else if (currentRow) {
                // This is a continuation of the current row
                currentRow += '\n' + line;
            }
            
            // Check if we're in quotes
            if (line.includes('"')) {
                const quoteCount = (line.match(/"/g) || []).length;
                if (quoteCount % 2 === 1) {
                    inQuotes = !inQuotes;
                }
            }
        }
        
        // Process the last row
        if (currentRow.trim()) {
            this.processCompleteRow(currentRow, headers, rows);
        }
        
        console.log(`Successfully parsed ${rows.length} complete rows`);
        return rows;
    }
    
    processCompleteRow(rowText, headers, rows) {
        try {
            console.log('Processing complete row:', rowText.substring(0, 100) + '...');
            
            const values = this.parseCSVRow(rowText);
            console.log(`Row values count:`, values.length);
            
            if (values.length >= headers.length) {
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                rows.push(row);
                console.log(`Row parsed successfully`);
            } else {
                console.warn(`Row has ${values.length} values, expected ${headers.length}`);
                console.warn('First few values:', values.slice(0, 5));
            }
        } catch (error) {
            console.error('Error processing row:', error);
        }
    }
    
    parseCSVRow(rowText) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < rowText.length; i++) {
            const char = rowText[i];
            const nextChar = i + 1 < rowText.length ? rowText[i + 1] : '';
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    // Toggle quote state
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last field
        result.push(current.trim());
        
        // Clean up fields
        return result.map(field => {
            // Remove surrounding quotes and unescape internal quotes
            if (field.startsWith('"') && field.endsWith('"')) {
                return field.slice(1, -1).replace(/""/g, '"');
            }
            return field;
        });
    }
    
    simpleCSVSplit(line) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const nextChar = i + 1 < line.length ? line[i + 1] : '';
            
            if (char === '"') {
                if (inQuotes && nextChar === '"') {
                    // Escaped quote
                    current += '"';
                    i++; // Skip next quote
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === ',' && !inQuotes) {
                // Field separator
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        // Add last field
        result.push(current.trim());
        
        // Clean up fields
        return result.map(field => {
            // Remove surrounding quotes
            if (field.startsWith('"') && field.endsWith('"')) {
                return field.slice(1, -1).replace(/""/g, '"');
            }
            return field;
        });
    }
    
    detectHumanData(rows) {
        if (rows.length === 0) return false;
        
        const firstRow = rows[0];
        return 'Task' in firstRow && 'Test' in firstRow && 'VerbalDescription' in firstRow;
    }
    
    setupNavigation() {
        console.log('Setting up navigation, isHumanMode:', this.isHumanMode);
        console.log('Data length:', this.data.length);
        console.log('First data row:', this.data[0]);
        // Ensure correct panels/controls are visible
        this.updateModeVisibility();
        
        if (this.isHumanMode) {
            this.setupHumanNavigation();
        } else {
            this.setupStandardNavigation();
        }
    }
    
    setupStandardNavigation() {
        console.log('Setting up standard navigation');
        const puzzles = [...new Set(this.data.map(r => this.getPuzzleFromRow(r)))].filter(p => p).sort();
        console.log('Found puzzles:', puzzles);
        
        const puzzleSelect = document.getElementById('puzzle-select');
        puzzleSelect.innerHTML = puzzles.map(p => `<option value="${p}">${p}</option>`).join('');
        
        if (puzzles.length > 0) {
            puzzleSelect.value = puzzles[0];
            console.log('Selected puzzle:', puzzles[0]);
            this.updateTests();
        } else {
            console.error('No puzzles found in data');
        }
    }
    
    setupHumanNavigation() {
        // Populate concepts from Human manifest to cover all 16
        const concepts = this._humanConceptsCache && this._humanConceptsCache.length
            ? this._humanConceptsCache
            : [...new Set(this.data.map(r => r.Task.split('/').pop().replace(/\.json$/, '').replace(/\d+$/, '')))].sort();
        const conceptSelect = document.getElementById('concept-select');
        conceptSelect.innerHTML = concepts.map(c => `<option value="${c}">${c}</option>`).join('');
        
        if (concepts.length > 0) {
            // Preserve the user's last selected concept if available
            const desired = this._humanSelectedConcept && concepts.includes(this._humanSelectedConcept)
                ? this._humanSelectedConcept
                : concepts[0];
            conceptSelect.value = desired;
            this.updateHumanPuzzles();
        }
    }
    
    updateTests() {
        const puzzle = document.getElementById('puzzle-select').value;
        console.log('Updating tests for puzzle:', puzzle);
        
        const matchingRows = this.data.filter(r => this.getPuzzleFromRow(r) === puzzle);
        console.log('Matching rows:', matchingRows);
        
        const tests = [...new Set(matchingRows.map(r => this.getTestIdxFromRow(r)))].filter(t => t).sort((a, b) => parseInt(a) - parseInt(b));
        console.log('Found tests:', tests);
        
        const testSelect = document.getElementById('test-select');
        testSelect.innerHTML = tests.map(t => `<option value="${t}">${t}</option>`).join('');
        
        if (tests.length > 0) {
            testSelect.value = tests[0];
            console.log('Selected test:', tests[0]);
        } else {
            console.error('No tests found for puzzle:', puzzle);
        }
    }
    
    updateHumanPuzzles() {
        const concept = document.getElementById('concept-select').value;
        const puzzles = [...new Set(this.data.filter(r => r.Task.includes(concept)).map(r => r.Task.split('/').pop().replace(/\.json$/, '')))].sort();
        const puzzleSelect = document.getElementById('human-puzzle-select');
        puzzleSelect.innerHTML = puzzles.map(p => `<option value="${p}">${p}</option>`).join('');
        
        if (puzzles.length > 0) {
            puzzleSelect.value = puzzles[0];
            this.updateHumanTests();
        }
    }
    
    updateHumanTests() {
        const puzzle = document.getElementById('human-puzzle-select').value;
        const tests = [...new Set(this.data.filter(r => r.Task.includes(puzzle)).map(r => r.Test))].sort((a, b) => parseInt(a) - parseInt(b));
        const testSelect = document.getElementById('human-test-select');
        testSelect.innerHTML = tests.map(t => `<option value="${t}">${t}</option>`).join('');
        
        if (tests.length > 0) {
            testSelect.value = tests[0];
            this.updateHumans();
            // Ensure view updates immediately when defaults are populated
            this.refresh();
        }
    }
    
    updateHumans() {
        const puzzle = document.getElementById('human-puzzle-select').value;
        const test = document.getElementById('human-test-select').value;
        const humans = this.data.filter(r => r.Task.includes(puzzle) && r.Test === test);
        const humanSelect = document.getElementById('human-select');
        humanSelect.innerHTML = humans.map((_, i) => `<option value="${i}">${i + 1}</option>`).join('');
        
        if (humans.length > 0) {
            humanSelect.value = '0';
            // Trigger refresh so rule status and grids show for the first human immediately
            this.refresh();
        }
    }
    
    async refresh() {
        if (!this.data) return;
        // Version guard to avoid out-of-order UI writes
        this._refreshVersion = (this._refreshVersion || 0) + 1;
        const v = this._refreshVersion;
        if (this.isHumanMode) {
            await this.refreshHumanMode(v);
        } else {
            await this.refreshStandardMode(v);
        }
    }
    
    async refreshStandardMode(v) {
        const puzzle = document.getElementById('puzzle-select').value;
        const test = document.getElementById('test-select').value;
        
        if (!puzzle || !test) return;
        
        const row = this.data.find(r => this.getPuzzleFromRow(r) === String(puzzle).trim() && this.getTestIdxFromRow(r) === String(test).trim());
        if (!row) return;
        
        // Load puzzle data via cache or fetch fallback
        const concept = this.getConceptFromRow(row, puzzle);
        console.log('Selected row:', {puzzle, test, concept, row});
        const puzzleData = await this.ensurePuzzleData(concept, puzzle);
        if (v !== this._refreshVersion) return;
        if (!puzzleData) {
            console.warn('No puzzle data loaded for', {concept, puzzle});
        }
        
        const testIdx = parseInt(test) - 1;
        const testInput = puzzleData && puzzleData.test && puzzleData.test[testIdx] ? puzzleData.test[testIdx].input : null;
        const groundTruth = puzzleData && puzzleData.test && puzzleData.test[testIdx] ? puzzleData.test[testIdx].output : null;
        
        // Display grids
        this.renderGrid('test-grid', testInput);
        this.renderGrid('gt-grid', groundTruth);
        
        // Parse and display model answer
        let modelAnswer = null;
        try {
            modelAnswer = this.parseGrid(row.answer);
        } catch (e) {
            console.error('Failed to parse model answer:', e);
        }
        this.renderGrid('answer-grid', modelAnswer);
        if (v !== this._refreshVersion) return;
        
        // Display demonstrations
        const demos = (puzzleData && Array.isArray(puzzleData.train)) ? puzzleData.train : [];
        console.log('Rendering demos:', {trainCount: demos.length, concept, puzzle});
        this.renderDemonstrations('demos-container', demos);
        if (v !== this._refreshVersion) return;
        
        // Display text content
        const modelRule = (row && typeof row.Rule !== 'undefined') ? String(row.Rule).trim() : '';
        const modelRuleEl = document.getElementById('model-rule-content');
        modelRuleEl.textContent = modelRule || 'No rule identified';
        // Assert model rule matches CSV Rule field exactly (after trim)
        try {
            const rawRule = (row && typeof row.Rule !== 'undefined') ? String(row.Rule).trim() : '';
            if (rawRule && rawRule !== modelRule.trim()) {
                console.warn('Model Rule mismatch between displayed and CSV value', {csv: rawRule, shown: modelRule});
                this.updateStatus('⚠️ Model Rule mismatch between CSV and display', 'info');
            }
        } catch (_) {}
        await this.ensureRulesLoaded();
        if (v !== this._refreshVersion) return;
        document.getElementById('gt-rule-content').textContent = (this.rulesMap && this.rulesMap[puzzle]) ? this.rulesMap[puzzle] : this.getGroundTruthRule(puzzle);
        document.getElementById('reasoning-content').textContent = this.getSummaryFromRow(row) || 'No reasoning summary available';
        
        // Update rule status panel (CSV Rule_correct_label only)
        this.updateRuleStatusPanel('rule-status-content', row);
        
        this.updateStatus('✅ Display updated');
    }
    
    async refreshHumanMode(v) {
        const concept = document.getElementById('concept-select').value;
        const puzzle = document.getElementById('human-puzzle-select').value;
        const test = document.getElementById('human-test-select').value;
        const humanIdx = parseInt(document.getElementById('human-select').value);
        
        if (!concept || !puzzle || !test) return;
        
        const humans = this.data.filter(r => r.Task.includes(puzzle) && r.Test === test);
        if (humanIdx >= humans.length) return;
        
        const row = humans[humanIdx];
        
        // Load puzzle data via cache or fetch fallback
        const puzzleData = await this.ensurePuzzleData(concept, puzzle);
        if (v !== this._refreshVersion) return;
        
        const testIdx = parseInt(test) - 1;
        const testInput = puzzleData.test[testIdx].input;
        const groundTruth = puzzleData.test[testIdx].output;
        
        // Display grids
        this.renderGrid('human-test-grid', testInput);
        this.renderGrid('human-gt-grid', groundTruth);
        
        // Display demonstrations
        this.renderDemonstrations('human-demos-container', puzzleData.train);
        if (v !== this._refreshVersion) return;
        
        // Display text content
        document.getElementById('human-rule-content').textContent = row.VerbalDescription || 'No rule description available';
        await this.ensureRulesLoaded();
        if (v !== this._refreshVersion) return;
        document.getElementById('human-gt-rule-content').textContent = (this.rulesMap && this.rulesMap[puzzle]) ? this.rulesMap[puzzle] : this.getGroundTruthRule(puzzle);
        
        // Update rule status panel (show judgment only, no validation/star)
        this.updateRuleStatusPanel('human-rule-status-content', row);
        
        this.updateStatus('✅ Human mode display updated');
    }
    
    renderGrid(containerId, grid) {
        const container = document.getElementById(containerId);
        const isValidMatrix = Array.isArray(grid) && grid.length > 0 && Array.isArray(grid[0]) && grid[0].length > 0;
        if (!grid || !isValidMatrix) {
            container.innerHTML = '<div class="no-data">No data</div>';
            return;
        }
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        const cellSize = this.calculateCellSize(grid, container);
        const width = grid[0].length * cellSize;
        const height = grid.length * cellSize;
        
        canvas.width = width;
        canvas.height = height;
        
        // Fill cells
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const color = this.colors[grid[r][c]] || this.colors[0];
                ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
        
        // Draw grid lines
        ctx.strokeStyle = 'rgb(204, 204, 204)';
        ctx.lineWidth = 1;
        
        for (let r = 0; r <= grid.length; r++) {
            const y = r * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        for (let c = 0; c <= grid[0].length; c++) {
            const x = c * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
        
        container.innerHTML = '';
        container.appendChild(canvas);
    }
    
    renderDemonstrations(containerId, demonstrations) {
        const container = document.getElementById(containerId);
        container.innerHTML = '';
        
        if (!demonstrations || demonstrations.length === 0) {
            container.innerHTML = '<div class="no-data">No demonstrations available</div>';
            return;
        }
        
        // Derive a conservative demo cell size relative to current test grid height
        let targetPanelHeight = 140;
        try {
            const testGrid = document.getElementById('test-grid');
            if (testGrid && testGrid.clientHeight) {
                // demos ~30% of test grid height, clamped
                targetPanelHeight = Math.max(80, Math.min(160, Math.floor(testGrid.clientHeight * 0.35)));
            }
        } catch (_) {}

        demonstrations.forEach((demo, idx) => {
            const demoContainer = document.createElement('div');
            demoContainer.className = 'demo-item';
            
            const title = document.createElement('div');
            title.className = 'demo-title';
            title.textContent = `Example ${idx + 1}`;
            demoContainer.appendChild(title);
            
            const inputCanvas = document.createElement('canvas');
            const outputCanvas = document.createElement('canvas');
            
            // Compute a smaller cell size so demos are visually subordinate to main grids
            const inputRows = Array.isArray(demo.input) ? demo.input.length : 1;
            const outputRows = Array.isArray(demo.output) ? demo.output.length : 1;
            const maxRows = Math.max(inputRows, outputRows, 1);
            let demoCell = Math.floor(targetPanelHeight / maxRows);
            // Clamp demo cell size to keep demos small
            demoCell = Math.max(6, Math.min(14, demoCell));
            
            this.renderGridToCanvas(inputCanvas, demo.input, demoCell);
            this.renderGridToCanvas(outputCanvas, demo.output, demoCell);
            
            const inputDiv = document.createElement('div');
            inputDiv.className = 'demo-input';
            inputDiv.appendChild(inputCanvas);
            
            const outputDiv = document.createElement('div');
            outputDiv.className = 'demo-output';
            outputDiv.appendChild(outputCanvas);
            
            demoContainer.appendChild(inputDiv);
            demoContainer.appendChild(outputDiv);
            container.appendChild(demoContainer);
        });
    }
    
    renderGridToCanvas(canvas, grid, cellSize) {
        const ctx = canvas.getContext('2d');
        const width = grid[0].length * cellSize;
        const height = grid.length * cellSize;
        
        canvas.width = width;
        canvas.height = height;
        
        // Fill cells
        for (let r = 0; r < grid.length; r++) {
            for (let c = 0; c < grid[r].length; c++) {
                const color = this.colors[grid[r][c]] || this.colors[0];
                ctx.fillStyle = `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
                ctx.fillRect(c * cellSize, r * cellSize, cellSize, cellSize);
            }
        }
        
        // Draw grid lines
        ctx.strokeStyle = 'rgb(204, 204, 204)';
        ctx.lineWidth = 1;
        
        for (let r = 0; r <= grid.length; r++) {
            const y = r * cellSize;
            ctx.beginPath();
            ctx.moveTo(0, y);
            ctx.lineTo(width, y);
            ctx.stroke();
        }
        
        for (let c = 0; c <= grid[0].length; c++) {
            const x = c * cellSize;
            ctx.beginPath();
            ctx.moveTo(x, 0);
            ctx.lineTo(x, height);
            ctx.stroke();
        }
    }
    
    calculateCellSize(grid, container) {
        if (!grid || grid.length === 0) return this.options.cellSize;
        
        const containerWidth = container.clientWidth - 20;
        const containerHeight = container.clientHeight - 20;
        
        const maxCellWidth = Math.floor(containerWidth / grid[0].length);
        const maxCellHeight = Math.floor(containerHeight / grid.length);
        
        const optimalSize = Math.min(maxCellWidth, maxCellHeight, this.options.maxCellSize);
        return Math.max(optimalSize, this.options.minCellSize);
    }
    
    parseGrid(gridString) {
        if (!gridString) return null;
        
        try {
            // Try to parse as JSON first
            const val = JSON.parse(gridString);
            // Accept [[...],[...]]
            if (Array.isArray(val) && Array.isArray(val[0])) return val;
            // Accept [ ... ] vector -> single-row grid
            if (Array.isArray(val) && val.every(x => Number.isFinite(Number(x)))) {
                return [val.map(x => Number(x))];
            }
            // Accept single number -> 1x1 grid
            if (Number.isFinite(Number(val))) {
                return [[Number(val)]];
            }
            // Fallback to string parsing below
        } catch (e) {
            // continue to delimiter parsing
        }
        // If not JSON or unsupported JSON shape, support both comma- and space-separated rows
        const lines = String(gridString).split('\n').map(l => l.trim()).filter(l => l.length);
        if (!lines.length) return null;
        const rows = lines.map(line => {
            const sep = line.includes(',') ? ',' : ' ';
            return line.split(sep).map(cell => {
                const v = Number(cell.trim());
                return Number.isFinite(v) ? v : 0;
            });
        });
        // If single scalar, wrap to 1x1
        if (rows.length === 1 && rows[0].length === 1) return [[rows[0][0]]];
        return rows;
    }
    
    getLoadedPuzzleData(concept, puzzleName) {
        if (!this.puzzlesByPuzzleName && !this.puzzlesByConceptAndName) return null;
        if (this.puzzlesByConceptAndName) {
            const key = `${concept}/${puzzleName}`;
            if (this.puzzlesByConceptAndName[key]) return this.puzzlesByConceptAndName[key];
        }
        if (this.puzzlesByPuzzleName && this.puzzlesByPuzzleName[puzzleName]) {
            return this.puzzlesByPuzzleName[puzzleName];
        }
        return null;
    }
    
    getGroundTruthRule(puzzleName) {
        // This would need to be provided as JSON data
        return `Ground truth rule for ${puzzleName}`;
    }

    async ensurePuzzleData(concept, puzzleName) {
        let data = this.getLoadedPuzzleData(concept, puzzleName);
        if (data) return data;
        const url = `${this.dataPath('/data/corpus')}/${concept}/${puzzleName}.json`;
        try {
            const res = await fetch(url, { cache: 'no-cache' });
            if (res.ok) {
                const json = await res.json();
                if (!this.puzzlesByPuzzleName) this.puzzlesByPuzzleName = {};
                if (!this.puzzlesByConceptAndName) this.puzzlesByConceptAndName = {};
                this.puzzlesByPuzzleName[puzzleName] = json;
                this.puzzlesByConceptAndName[`${concept}/${puzzleName}`] = json;
                return json;
            }
        } catch (e) {
            console.warn('Failed to fetch puzzle JSON:', url, e);
        }
        this.updateStatus('⚠️ Puzzle JSON not loaded. Add files under data/corpus/<Concept>/<Puzzle>.json or use "Load Puzzles".', 'info');
        return null;
    }

    async ensureRulesLoaded() {
        if (this.rulesMap) return;
        try {
            const res = await fetch(this.dataPath('/data/ConceptARC_rules.csv'), { cache: 'no-cache' });
            if (!res.ok) return;
            const text = await res.text();
            const lines = text.split('\n').filter(l => l.trim());
            const header = lines.shift();
            if (!header) return;
            const headerCells = this.parseCSVRow(header);
            const taskIdx = headerCells.findIndex(h => /^task$/i.test(h));
            const ruleIdx = headerCells.findIndex(h => /^rule$/i.test(h));
            if (taskIdx === -1 || ruleIdx === -1) return;
            const map = {};
            for (const line of lines) {
                const cells = this.parseCSVRow(line);
                const task = (cells[taskIdx] || '').replace(/\.json$/i, '').trim();
                const rule = (cells[ruleIdx] || '').trim();
                if (task) map[task] = rule;
            }
            this.rulesMap = map;
        } catch (e) {
            console.warn('Failed to load rules CSV:', e);
        }
    }
    
    updateRuleStatusPanel(containerId, row) {
        const container = document.getElementById(containerId);
        if (!container) return;
        // Determine if this selection has rule evaluation available
        const modality = document.getElementById('modality-select').value;
        const model = document.getElementById('model-select').value;
        const setting = document.getElementById('setting-select').value;
        const hasEval = this.selectionHasRuleEvaluation(modality, model, setting);
        const evalLabel = hasEval ? (row.Rule_correct_label || row.rule_correct_label || row['Rule_correct_label'] || '') : '';
        const parts = [];
        if (evalLabel && String(evalLabel).trim() !== '') {
            parts.push(`<div class="status-item"><strong>Rule evaluation status:</strong> ${String(evalLabel).trim()}</div>`);
        }
        const isCorrectRaw = (typeof row.is_correct !== 'undefined') ? String(row.is_correct).trim() : '';
        if (isCorrectRaw !== '') {
            const gridText = isCorrectRaw === '1' ? '✅ Correct' : (isCorrectRaw === '0' ? '❌ Incorrect' : isCorrectRaw);
            parts.push(`<div class="status-item"><strong>Grid status:</strong> ${gridText}</div>`);
        }
        container.innerHTML = parts.length ? parts.join('') : '<div class="no-status">No status information available</div>';
    }

    selectionHasRuleEvaluation(modality, model, setting) {
        // Which (modality, model, setting) combinations have rule-evaluation labels in the shipped CSVs.
        // - o3: evaluated (text + visual)
        // - Human: evaluated
        // - o4-mini, gpt4o, qwen2.5-vl-72b, llama-scout: not evaluated in this bundle
        // - claude-sonnet-4, gemini-2.5-pro: medium and medium+tools (text + visual) include labels
        if (model === 'o3') return true;
        if (model === 'Human') return true;
        if (model === 'o4-mini') return false;
        if (model === 'gpt4o') return false;
        if (model === 'qwen2.5-vl-72b') return false;
        if (model === 'llama-scout') return false;
        if (model === 'claude-sonnet-4') return setting === 'medium' || setting === 'medium+tools';
        if (model === 'gemini-2.5-pro') return setting === 'medium' || setting === 'medium+tools';
        return false;
    }
    
    navigateLeft() {
        if (this.isHumanMode) {
            // Human mode: human -> test -> puzzle
            const humanSel = document.getElementById('human-select');
            if (humanSel && humanSel.selectedIndex > 0) {
                humanSel.selectedIndex = humanSel.selectedIndex - 1;
                this.refresh();
                return;
            }
            const testSel = document.getElementById('human-test-select');
            if (testSel && testSel.selectedIndex > 0) {
                testSel.selectedIndex = testSel.selectedIndex - 1;
                this.updateHumans();
                this.refresh();
                return;
            }
            const puzzleSel = document.getElementById('human-puzzle-select');
            if (puzzleSel && puzzleSel.selectedIndex > 0) {
                puzzleSel.selectedIndex = puzzleSel.selectedIndex - 1;
                this.updateHumanTests();
                this.updateHumans();
                this.refresh();
                return;
            }
            return;
        }
        // Standard mode
        const testSel = document.getElementById('test-select');
        if (testSel && testSel.selectedIndex > 0) {
            testSel.selectedIndex = testSel.selectedIndex - 1;
            this.refresh();
            return;
        }
        const puzzleSel = document.getElementById('puzzle-select');
        if (puzzleSel) {
            const puzzles = [...new Set(this.data.map(r => this.getPuzzleFromRow(r)))].filter(Boolean).sort();
            const curr = puzzleSel.value;
            const idx = puzzles.indexOf(curr);
            if (idx > 0) {
                const prevPuzzle = puzzles[idx - 1];
                puzzleSel.value = prevPuzzle;
                this.updateTests();
                // set last test
                const tSel = document.getElementById('test-select');
                if (tSel && tSel.options.length > 0) {
                    tSel.selectedIndex = tSel.options.length - 1;
                }
                this.refresh();
            }
        }
    }
    
    navigateRight() {
        if (this.isHumanMode) {
            // Human mode: human -> test -> puzzle
            const humanSel = document.getElementById('human-select');
            if (humanSel && humanSel.selectedIndex < humanSel.options.length - 1) {
                humanSel.selectedIndex = humanSel.selectedIndex + 1;
                this.refresh();
                return;
            }
            const testSel = document.getElementById('human-test-select');
            if (testSel && testSel.selectedIndex < testSel.options.length - 1) {
                testSel.selectedIndex = testSel.selectedIndex + 1;
                this.updateHumans();
                this.refresh();
                return;
            }
            const puzzleSel = document.getElementById('human-puzzle-select');
            if (puzzleSel && puzzleSel.selectedIndex < puzzleSel.options.length - 1) {
                puzzleSel.selectedIndex = puzzleSel.selectedIndex + 1;
                this.updateHumanTests();
                this.updateHumans();
                this.refresh();
                return;
            }
            return;
        }
        // Standard mode
        const testSel = document.getElementById('test-select');
        if (testSel && testSel.selectedIndex < testSel.options.length - 1) {
            testSel.selectedIndex = testSel.selectedIndex + 1;
            this.refresh();
            return;
        }
        const puzzleSel = document.getElementById('puzzle-select');
        if (puzzleSel) {
            const puzzles = [...new Set(this.data.map(r => this.getPuzzleFromRow(r)))].filter(Boolean).sort();
            const curr = puzzleSel.value;
            const idx = puzzles.indexOf(curr);
            if (idx !== -1 && idx < puzzles.length - 1) {
                const nextPuzzle = puzzles[idx + 1];
                puzzleSel.value = nextPuzzle;
                this.updateTests();
                // set first test
                const tSel = document.getElementById('test-select');
                if (tSel && tSel.options.length > 0) {
                    tSel.selectedIndex = 0;
                }
                this.refresh();
            }
        }
    }
    
    updateStatus(message, type = 'info') {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = `status ${type}`;
    }

    updatePerformanceIndicator() {
        try {
            const el = document.getElementById('performance-indicator');
            if (!el || !this.data || this.data.length === 0) return;
            let total = 0;
            let correct = 0;
            for (const r of this.data) {
                if (r && typeof r.is_correct !== 'undefined' && r.is_correct !== '') {
                    total += 1;
                    if (String(r.is_correct).trim() === '1') correct += 1;
                }
            }
            if (total === 0) {
                el.textContent = 'Performance: --';
                el.style.color = '#6c757d';
                return;
            }
            const pct = (correct / total) * 100;
            el.textContent = `Performance: (${correct}/${total}) ${pct.toFixed(1)}%`;
            el.style.color = pct < 50 ? '#dc3545' : (pct < 80 ? '#ffc107' : '#28a745');
        } catch (_) {}
    }

    async populateStaticConcepts(basePath) {
        try {
            const humanBase = this.dataPath('/data/logs/Human');
            const manifestUrl = (basePath.endsWith('/Human') || basePath.endsWith('Human') ? `${humanBase}/manifest.json` : `${basePath}/manifest.json`);
            let files = [];
            try {
                const res = await fetch(manifestUrl, { cache: 'no-cache' });
                if (res.ok) {
                    const m = await res.json();
                    if (m && Array.isArray(m.files)) files = m.files;
                    // Cache human concepts for use in Human mode navigation
                    if (basePath.endsWith('/Human') || basePath.endsWith('Human')) {
                        this._humanConceptsCache = files
                          .map(f => f.replace(/\.(csv|json)$/i,'').trim())
                          .sort((a,b) => a.localeCompare(b, undefined, {sensitivity:'base'}));
                    }
                }
            } catch (_) {}
            if (!files.length) {
                files = [];
            }
            const sel = document.getElementById('static-concept-select');
            if (!sel) return;
            // Filter to the canonical 16 ConceptARC concepts and sort
            const allowedConcepts = new Set([
                'AboveBelow','Center','CleanUp','CompleteShape','Copy','Count',
                'ExtendToBoundary','ExtractObjects','FilledNotFilled','HorizontalVertical',
                'InsideOutside','MoveToBoundary','Order','SameDifferent','TopBottom2D','TopBottom3D'
            ]);
            const concepts = files
                .map(f => f.replace(/\.(csv|json)$/i,'').trim())
                .filter(name => allowedConcepts.has(name))
                .sort((a,b) => a.localeCompare(b, undefined, {sensitivity:'base'}));
            sel.innerHTML = concepts.map(c => `<option value="${c}">${c}</option>`).join('');
            const loadBtn = document.getElementById('load-dataset-btn');
            if (concepts.length > 0) {
                sel.disabled = false;
                if (loadBtn) loadBtn.disabled = false;
                sel.value = concepts[0];
                this.updateStatus(`📚 ${concepts.length} concepts available`, 'info');
            } else {
                sel.disabled = true;
                if (loadBtn) loadBtn.disabled = true;
                this.updateStatus('ℹ️ No dataset available for this selection', 'info');
            }
        } catch (_) {}
    }

    async populateConceptsFromSelectors() {
        const base = this.resolveBasePathFromSelectors();
        await this.populateStaticConcepts(base);
    }

    resolveBasePathFromSelectors() {
        const modality = document.getElementById('modality-select').value;
        const model = document.getElementById('model-select').value;
        const setting = 'medium';
        const textualMap = {
            Human: { any: 'json' },
            o3: { medium: 'mediumeffort_autosummary' },
            'claude-sonnet-4': { medium: 'mediumeffort_autosummary' },
            'gemini-2.5-pro': { medium: 'mediumeffort_autosummary' },
        };
        const visualMap = {
            Human: { any: 'json' },
            o3: { medium: 'nosplit_cell60_mediumeffort_autosummary' },
            'claude-sonnet-4': { medium: 'nosplit_cell60_mediumeffort_autosummary' },
            'gemini-2.5-pro': { medium: 'nosplit_cell60_mediumeffort_autosummary' },
        };
        if (model === 'Human') {
            return this.dataPath('/data/logs/Human');
        }
        const map = modality === 'Textual' ? textualMap : visualMap;
        const leaf = map[model] && (map[model][setting] || map[model].any) || '';
        return this.dataPath(`/data/logs/${modality}/${model}/${leaf}`);
    }

    refreshSettingOptions() {
        const settingSel = document.getElementById('setting-select');
        if (!settingSel) return;
        settingSel.innerHTML = '<option value="medium" selected>medium</option>';
    }

    async loadFromSelectors() {
        const base = this.resolveBasePathFromSelectors();
        const concept = document.getElementById('static-concept-select').value;
        if (!base || !concept) {
            this.updateStatus('❌ Select modality/model/setting/concept first', 'error');
            return;
        }
        await this.loadStaticConceptDataset(base, concept);
    }

    async loadStaticConceptDataset(basePath, conceptName) {
        // Prefer JSON (pre-converted) if present
        const isHuman = basePath.endsWith('/Human') || basePath.endsWith('Human');
        const humanBase = this.dataPath('/data/logs/Human');
        const jsonUrl = isHuman ? `${humanBase}/json/${conceptName}.json?v=${Date.now()}` : `${basePath}/json/${conceptName}.json?v=${Date.now()}`;
        const csvUrl  = isHuman ? `` : `${basePath}/${conceptName}.csv?v=${Date.now()}`;
        try {
            let rows = [];
            // Try JSON first
            let res = await fetch(jsonUrl, { cache: 'no-store' });
            if (res.ok) {
                rows = await res.json();
            } else {
                // Fallback to CSV (not used for Human)
                if (!csvUrl) {
                    this.updateStatus(`❌ Failed to load dataset: ${conceptName}`, 'error');
                    return;
                }
                res = await fetch(csvUrl, { cache: 'no-store' });
                if (!res.ok) {
                    this.updateStatus(`❌ Failed to load dataset: ${conceptName}`, 'error');
                    return;
                }
                const text = await res.text();
                rows = this.parseCSV(text);
            }
            if (!Array.isArray(rows) || !rows.length) {
                this.updateStatus(`❌ Empty dataset for ${conceptName}`, 'error');
                return;
            }
            this.isHumanMode = this.detectHumanData(rows);
            this.data = rows;
            this._headers = Object.keys(rows[0] || {});
            this.updateStatus(`✅ Loaded ${rows.length} rows from ${conceptName}`);
            try {
                this.updateModeVisibility();
                this.setupNavigation();
                await this.refresh();
                this.updatePerformanceIndicator();
            } catch (err) {
                console.error('Display error after dataset load:', err);
                this.updateStatus('⚠️ Dataset loaded, display encountered an error (see console)', 'info');
            }
        } catch (e) {
            console.error('Dataset fetch error:', url, e);
            this.updateStatus('❌ Failed to load dataset', 'error');
        }
    }

    updateModeVisibility() {
        const showHuman = !!this.isHumanMode;
        const stdControls = document.getElementById('standard-controls');
        const humanControls = document.getElementById('human-controls');
        const stdLeft = document.getElementById('standard-left-panels');
        const humanLeft = document.getElementById('human-left-panels');
        const stdRight = document.getElementById('standard-right-panels');
        const humanRight = document.getElementById('human-right-panels');
        const staticConceptLabel = document.getElementById('static-concept-label');
        const staticConceptSelect = document.getElementById('static-concept-select');
        const loadBtn = document.getElementById('load-dataset-btn');
        if (stdControls) stdControls.style.display = showHuman ? 'none' : '';
        if (humanControls) humanControls.style.display = showHuman ? '' : 'none';
        if (stdLeft) stdLeft.style.display = showHuman ? 'none' : '';
        if (humanLeft) humanLeft.style.display = showHuman ? '' : 'none';
        if (stdRight) stdRight.style.display = showHuman ? 'none' : '';
        if (humanRight) humanRight.style.display = showHuman ? '' : 'none';
        // Hide dataset concept selector and Load button in Human mode to avoid duplicate concept dropdown
        if (staticConceptLabel) staticConceptLabel.style.display = showHuman ? 'none' : '';
        if (staticConceptSelect) staticConceptSelect.style.display = showHuman ? 'none' : '';
        // Keep Load button visible so users can switch back to model datasets
        if (loadBtn) loadBtn.style.display = '';
    }
    
    createTestData() {
        console.log('Creating test data...');
        return [
            {
                puzzle: 'AboveBelow1',
                test_idx: '1',
                answer: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
                Rule: 'Move all objects above the horizontal line to below the line',
                summary: 'The pattern involves moving objects above the line to below the line.',
                is_correct: '1',
                Rule_correct_label: 'Correct - Intended',
                validation_level: '2',
                starred: '0'
            },
            {
                puzzle: 'AboveBelow1',
                test_idx: '2',
                answer: '[[0, 1, 0], [2, 3, 4], [0, 5, 0]]',
                Rule: 'Move objects above the line to below the line',
                summary: 'Similar to the first test, I need to move objects above the line to below.',
                is_correct: '1',
                Rule_correct_label: 'Correct - Intended',
                validation_level: '2',
                starred: '1'
            },
            {
                puzzle: 'Center1',
                test_idx: '1',
                answer: '[[0, 0, 0], [0, 1, 0], [0, 0, 0]]',
                Rule: 'Place a single object at the center of the grid',
                summary: 'The pattern is to place a single object at the center of the grid.',
                is_correct: '1',
                Rule_correct_label: 'Correct - Intended',
                validation_level: '2',
                starred: '0'
            },
            {
                puzzle: 'Copy1',
                test_idx: '1',
                answer: '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]',
                Rule: 'Copy the input grid exactly to the output',
                summary: 'The pattern is to copy the input grid exactly to the output.',
                is_correct: '1',
                Rule_correct_label: 'Correct - Intended',
                validation_level: '1',
                starred: '0'
            }
        ];
    }
    
    // Debug function - call from browser console
    debugCSV() {
        console.log('=== CSV DEBUG INFO ===');
        console.log('Data loaded:', !!this.data);
        console.log('Data length:', this.data ? this.data.length : 0);
        if (this.data && this.data.length > 0) {
            console.log('First row:', this.data[0]);
            console.log('Available fields:', Object.keys(this.data[0]));
            console.log('Puzzle values:', this.data.map(r => r.puzzle).filter(p => p));
            console.log('Test values:', this.data.map(r => r.test_idx).filter(t => t));
        }
        console.log('Is human mode:', this.isHumanMode);
        console.log('=====================');
    }
}

// Export for use in modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ConceptARCVisualizer;
}
