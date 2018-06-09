import { pickExporter, pickFormat } from "../services/exporter/exporters";

import { Command } from './command';
import * as vscode from 'vscode';
import { testMarkdown } from '../services/exporter/shared';
import { exportOption } from "../services/exporter/interfaces";
import { MarkdownExport } from "../services/exporter/export";

export class CommandExportCurrent extends Command {
    async execute() {
        if (!testMarkdown()) return;
        let editor = vscode.window.activeTextEditor;
        if (!editor) editor = vscode.window.visibleTextEditors[0];
        if (!editor || !editor.document) {
            vscode.window.showInformationMessage("No document found.");
            return;
        }
        let document = editor.document;
        let format = await pickFormat();
        if (!format) return;
        let exporter = await pickExporter(format);
        if (!exporter) return;

        return vscode.window.withProgress(
            <vscode.ProgressOptions>{
                location: vscode.ProgressLocation.Notification,
                title: `Exporting to ${format}...`
            },
            progress => MarkdownExport(
                document,
                <exportOption>{
                    exporter: exporter,
                    progress: progress,
                    format: format
                }
            )
        );
    }
    constructor() {
        super("markdownExtended.export");
    }
}

