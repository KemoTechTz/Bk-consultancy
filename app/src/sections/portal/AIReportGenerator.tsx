import { useState } from 'react';
import {
  Sparkles,
  FileText,
  Download,
  Copy,
  Check,
  Loader2,
  Upload,
  Wand2,
  FileCheck,
  AlertCircle,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { API_BASE_URL } from '@/config';

const reportTypes = [
  { value: 'eia', label: 'Environmental Impact Assessment Summary', icon: FileText },
  { value: 'audit', label: 'Environmental Audit Report', icon: FileCheck },
  { value: 'epp', label: 'Environmental Protection Plan', icon: Upload },
  { value: 'compliance', label: 'Compliance Status Report', icon: Check },
];

export default function AIReportGenerator() {
  const [reportType, setReportType] = useState('');
  const [projectName, setProjectName] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedReport, setGeneratedReport] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!reportType || !projectName) return;

    try {
      setIsGenerating(true);
      setError('');
      setGeneratedReport('');

      const response = await fetch(`${API_BASE_URL}/dashboard/ai-report`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportType, projectName, projectLocation, projectDescription }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate report');
      }

      const data = await response.json();
      setGeneratedReport(data.report || 'No report generated.');
    } catch {
      setError('Unable to generate report right now. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedReport);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = (format: 'pdf' | 'docx') => {
    const blob = new Blob([generatedReport], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `environmental-report-${new Date().toISOString().split('T')[0]}.${format === 'pdf' ? 'txt' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-[#0a1f12] p-4 lg:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-eco-500 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-heading font-bold text-white">AI Report Generator</h1>
                <p className="text-gray-400 text-sm">Generate professional environmental reports from live backend data</p>
              </div>
            </div>
            <Button variant="ghost" onClick={() => (window.location.hash = '')} className="text-gray-400 hover:text-eco-400 transition-colors">← Back to Home</Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader>
              <CardTitle className="text-white">Report Configuration</CardTitle>
              <CardDescription className="text-gray-400">Provide project details to generate a customized report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm text-gray-300 mb-2 block">Report Type *</label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger className="bg-[#0a1f12] border-eco-500/30 text-white">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#0f2e15] border-eco-500/30">
                    {reportTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value} className="text-white hover:bg-eco-500/20">
                        <div className="flex items-center gap-2">
                          <type.icon className="w-4 h-4 text-eco-400" />
                          {type.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Project Name *</label>
                <Input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="e.g., Dodoma Industrial Park" className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500" />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Project Location</label>
                <Input value={projectLocation} onChange={(e) => setProjectLocation(e.target.value)} placeholder="e.g., Dodoma, Tanzania" className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500" />
              </div>

              <div>
                <label className="text-sm text-gray-300 mb-2 block">Project Description</label>
                <Textarea value={projectDescription} onChange={(e) => setProjectDescription(e.target.value)} placeholder="Describe the project scope, activities, and specific environmental concerns..." className="bg-[#0a1f12] border-eco-500/30 text-white placeholder:text-gray-500 min-h-[120px]" />
              </div>

              <Button onClick={handleGenerate} disabled={!reportType || !projectName || isGenerating} className="w-full bg-gradient-to-r from-purple-600 to-eco-600 hover:from-purple-500 hover:to-eco-500 text-white py-3 rounded-xl disabled:opacity-50">
                {isGenerating ? (
                  <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Generating Report...</>
                ) : (
                  <><Wand2 className="w-5 h-5 mr-2" />Generate Report</>
                )}
              </Button>
              {error && <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">{error}</div>}
            </CardContent>
          </Card>

          <Card className="bg-[#0f2e15] border-eco-500/20">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-white">Generated Report</CardTitle>
                <CardDescription className="text-gray-400">Preview and download your report</CardDescription>
              </div>
              {generatedReport && (
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={handleCopy} className="btn-outline">{copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDownload('pdf')} className="btn-outline"><Download className="w-4 h-4" /></Button>
                </div>
              )}
            </CardHeader>
            <CardContent>
              {generatedReport ? (
                <Tabs defaultValue="preview" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 bg-[#0a1f12]">
                    <TabsTrigger value="preview">Preview</TabsTrigger>
                    <TabsTrigger value="raw">Raw Text</TabsTrigger>
                  </TabsList>
                  <TabsContent value="preview" className="mt-4">
                    <div className="max-h-[500px] overflow-y-auto rounded-lg border border-eco-500/20 bg-[#0a1f12] p-4">
                      <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">{generatedReport}</pre>
                    </div>
                  </TabsContent>
                  <TabsContent value="raw" className="mt-4">
                    <Textarea value={generatedReport} readOnly className="min-h-[500px] bg-[#0a1f12] border-eco-500/30 text-gray-300 font-mono text-sm" />
                  </TabsContent>
                </Tabs>
              ) : (
                <div className="h-[500px] flex flex-col items-center justify-center text-center">
                  <FileText className="w-16 h-16 text-gray-600 mb-4" />
                  <p className="text-gray-400 mb-2">No report generated yet</p>
                  <p className="text-gray-500 text-sm">Configure your report and click generate to create a live report</p>
                  <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20 max-w-sm">
                    <AlertCircle className="w-5 h-5 text-blue-400 mx-auto mb-2" />
                    <p className="text-blue-300 text-xs">Reports are generated server-side from live backend context and project metadata.</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
