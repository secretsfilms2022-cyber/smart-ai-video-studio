import { useT } from '../i18n/locale';
import { purgeProjectCascade } from '../persist/mediaCleanup';
import {
  createProject,
  duplicateProject,
  randomProjectName,
  renameProject,
} from '../persist/projectStore';
import { buildProjectExport, importProjectPackage } from '../persist/projectTransfer';
import { emptyProjectDoc, navigateTo } from './appShell';
import { setPendingAiDirectorJob, type AiDirectorAspect, type AiDirectorStyle } from '../aiDirector/pendingJob';

type Translate = (zh: string, params?: Record<string, string | number>) => string;

export interface DashboardActions {
  onOpen: (id: string) => void;
  onNew: () => Promise<void>;
  onStartAiEdit: (file: File, style: AiDirectorStyle, aspect: AiDirectorAspect, duration: string) => Promise<void>;
  onRename: (id: string, name: string) => Promise<void>;
  onDuplicate: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onExport: (id: string, name: string) => Promise<string>;
  onImport: (file: File) => Promise<string>;
}

function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}

async function exportProject(t: Translate, id: string, name: string): Promise<string> {
  const result = await buildProjectExport(id, name);
  downloadBlob(result.blob, result.filename);
  return result.mediaMissing.length
    ? t('已导出「{name}」;{n} 个素材两端都取不到,未随包', { name, n: result.mediaMissing.length })
    : t('已导出「{name}」(含 {n} 个素材)', { name, n: result.mediaTotal });
}

async function importProject(t: Translate, file: File, refresh: () => Promise<void>): Promise<string> {
  try {
    const result = await importProjectPackage(file);
    await refresh();
    return result.mediaMissing.length
      ? t('已导入「{name}」;缺 {n} 个素材({list})', {
        name: result.meta.name,
        n: result.mediaMissing.length,
        list: result.mediaMissing.map((source: string) => source.split('/').pop()).join('、'),
      })
      : t('已导入「{name}」(素材 {a}/{b})', {
        name: result.meta.name,
        a: result.mediaRestored,
        b: result.mediaTotal,
      });
  } catch (error) {
    return t('导入失败:{error}', { error: error instanceof Error ? error.message : String(error) });
  }
}

export function useDashboardActions(refresh: () => Promise<void>): DashboardActions {
  const t = useT();
  return {
    onOpen: (id) => navigateTo(`#/editor/${id}`),
    onNew: async () => {
      const project = await createProject(randomProjectName(), emptyProjectDoc());
      await refresh();
      navigateTo(`#/editor/${project.id}`);
    },
    onStartAiEdit: async (file, style, aspect, duration) => {
      setPendingAiDirectorJob({
        file,
        style,
        aspect,
        duration,
        prompt: `Use the smart-digital-studio-auto-edit skill. Edit this uploaded footage end-to-end as a polished ${style} video. Target ${duration} and ${aspect}. Analyze the real footage, select the strongest moments, build the editable timeline, detect scenes, use transcript when speech exists, add useful captions, reframe for the output, apply restrained professional color correction, add suitable available audio, verify final frames, and export the finished result as an MP4 using the app's built-in export pipeline. Preserve natural faces and do not invent events. Execute the edit rather than only giving ideas.`,
      });
      const project = await createProject(`Smart Digital Studio · ${style}`, emptyProjectDoc());
      await refresh();
      navigateTo(`#/editor/${project.id}`);
    },
    onRename: async (id, name) => { await renameProject(id, name); refresh(); },
    onDuplicate: async (id) => { await duplicateProject(id); refresh(); },
    onDelete: async (id) => { await purgeProjectCascade(id); refresh(); },
    onExport: (id, name) => exportProject(t, id, name),
    onImport: (file) => importProject(t, file, refresh),
  };
}
