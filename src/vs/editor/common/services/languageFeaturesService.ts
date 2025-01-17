/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import { URI } from 'vs/base/common/uri';
import { LanguageFeatureRegistry } from 'vs/editor/common/languageFeatureRegistry';
import { CodeActionProvider, CodeLensProvider, CompletionItemProvider, DeclarationProvider, DefinitionProvider, DocumentColorProvider, DocumentFormattingEditProvider, DocumentHighlightProvider, DocumentRangeFormattingEditProvider, DocumentRangeSemanticTokensProvider, DocumentSemanticTokensProvider, DocumentSymbolProvider, EvaluatableExpressionProvider, FoldingRangeProvider, HoverProvider, ImplementationProvider, InlayHintsProvider, InlineCompletionsProvider, InlineValuesProvider, LinkedEditingRangeProvider, LinkProvider, OnTypeFormattingEditProvider, ReferenceProvider, RenameProvider, SelectionRangeProvider, SignatureHelpProvider, TypeDefinitionProvider } from 'vs/editor/common/languages';
import { LanguageSelector, score } from 'vs/editor/common/languageSelector';
import { ILanguageFeaturesService, RefineScoreFunction } from 'vs/editor/common/services/languageFeatures';
import { registerSingleton } from 'vs/platform/instantiation/common/extensions';

export class LanguageFeaturesService implements ILanguageFeaturesService {

	declare _serviceBrand: undefined;

	readonly referenceProvider = new LanguageFeatureRegistry<ReferenceProvider>(this._score.bind(this));
	readonly renameProvider = new LanguageFeatureRegistry<RenameProvider>(this._score.bind(this));
	readonly codeActionProvider = new LanguageFeatureRegistry<CodeActionProvider>(this._score.bind(this));
	readonly definitionProvider = new LanguageFeatureRegistry<DefinitionProvider>(this._score.bind(this));
	readonly typeDefinitionProvider = new LanguageFeatureRegistry<TypeDefinitionProvider>(this._score.bind(this));
	readonly declarationProvider = new LanguageFeatureRegistry<DeclarationProvider>(this._score.bind(this));
	readonly implementationProvider = new LanguageFeatureRegistry<ImplementationProvider>(this._score.bind(this));
	readonly documentSymbolProvider = new LanguageFeatureRegistry<DocumentSymbolProvider>(this._score.bind(this));
	readonly inlayHintsProvider = new LanguageFeatureRegistry<InlayHintsProvider>(this._score.bind(this));
	readonly colorProvider = new LanguageFeatureRegistry<DocumentColorProvider>(this._score.bind(this));
	readonly codeLensProvider = new LanguageFeatureRegistry<CodeLensProvider>(this._score.bind(this));
	readonly documentFormattingEditProvider = new LanguageFeatureRegistry<DocumentFormattingEditProvider>(this._score.bind(this));
	readonly documentRangeFormattingEditProvider = new LanguageFeatureRegistry<DocumentRangeFormattingEditProvider>(this._score.bind(this));
	readonly onTypeFormattingEditProvider = new LanguageFeatureRegistry<OnTypeFormattingEditProvider>(this._score.bind(this));
	readonly signatureHelpProvider = new LanguageFeatureRegistry<SignatureHelpProvider>(this._score.bind(this));
	readonly hoverProvider = new LanguageFeatureRegistry<HoverProvider>(this._score.bind(this));
	readonly documentHighlightProvider = new LanguageFeatureRegistry<DocumentHighlightProvider>(this._score.bind(this));
	readonly selectionRangeProvider = new LanguageFeatureRegistry<SelectionRangeProvider>(this._score.bind(this));
	readonly foldingRangeProvider = new LanguageFeatureRegistry<FoldingRangeProvider>(this._score.bind(this));
	readonly linkProvider = new LanguageFeatureRegistry<LinkProvider>(this._score.bind(this));
	readonly inlineCompletionsProvider = new LanguageFeatureRegistry<InlineCompletionsProvider>(this._score.bind(this));
	readonly completionProvider = new LanguageFeatureRegistry<CompletionItemProvider>(this._score.bind(this));
	readonly linkedEditingRangeProvider = new LanguageFeatureRegistry<LinkedEditingRangeProvider>(this._score.bind(this));
	readonly inlineValuesProvider = new LanguageFeatureRegistry<InlineValuesProvider>(this._score.bind(this));
	readonly evaluatableExpressionProvider = new LanguageFeatureRegistry<EvaluatableExpressionProvider>(this._score.bind(this));
	readonly documentRangeSemanticTokensProvider = new LanguageFeatureRegistry<DocumentRangeSemanticTokensProvider>(this._score.bind(this));
	readonly documentSemanticTokensProvider = new LanguageFeatureRegistry<DocumentSemanticTokensProvider>(this._score.bind(this));

	private _refinedScore?: RefineScoreFunction;

	setScoreRefineFunction(fn: RefineScoreFunction | undefined): void {
		this._refinedScore = fn;
	}

	private _score(selector: LanguageSelector | undefined, candidateUri: URI, candidateLanguage: string, candidateIsSynchronized: boolean) {
		const base = score(selector, candidateUri, candidateLanguage, candidateIsSynchronized);
		if (base === 0 || !selector) {
			return base;
		}
		if (!this._refinedScore) {
			return base;
		}
		const refined = this._refinedScore(base, selector, candidateUri, candidateLanguage);
		if (refined === 0) {
			return 0;
		} else {
			return Math.max(refined, base);
		}
	}

}

registerSingleton(ILanguageFeaturesService, LanguageFeaturesService, true);
