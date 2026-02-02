# 如何创建 GitHub Personal Access Token

## 步骤 1：访问 Token 设置页面

1. 登录您的 GitHub 账户：https://github.com
2. 点击右上角的头像
3. 选择 **Settings**（设置）

或者直接访问：
**https://github.com/settings/tokens**

## 步骤 2：创建新的 Token

1. 在左侧菜单中，向下滚动找到 **Developer settings**（开发者设置）
2. 点击 **Personal access tokens**（个人访问令牌）
3. 选择 **Tokens (classic)**（经典令牌）
4. 点击 **Generate new token**（生成新令牌）
5. 选择 **Generate new token (classic)**（生成经典令牌）

## 步骤 3：配置 Token

填写以下信息：

### Token 名称
- **Note**（备注）：输入一个描述性名称，例如 `S9-2.0项目推送`

### 过期时间
- **Expiration**（过期时间）：选择过期时间
  - 建议选择 **90 days**（90天）或 **No expiration**（永不过期）
  - ⚠️ 注意：如果选择永不过期，请妥善保管 token

### 权限范围（Scopes）
至少需要勾选以下权限：

- ✅ **repo**（完整仓库访问权限）
  - 包括所有子权限：
    - `repo:status` - 访问提交状态
    - `repo_deployment` - 访问部署状态
    - `public_repo` - 访问公共仓库
    - `repo:invite` - 访问仓库邀请
    - `security_events` - 访问安全事件

如果需要其他功能，还可以勾选：
- **workflow** - 更新 GitHub Action 工作流
- **write:packages** - 上传包到 GitHub Packages
- **delete:packages** - 删除包

## 步骤 4：生成并复制 Token

1. 滚动到页面底部
2. 点击 **Generate token**（生成令牌）按钮
3. ⚠️ **重要**：立即复制生成的 token！
   - Token 只会显示一次
   - 如果关闭页面，将无法再次查看
   - 格式类似：`ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

## 步骤 5：使用 Token 推送代码

### 方法 1：在推送时使用 Token

当 Git 提示输入密码时：
- **用户名**：`GHVBUGB`
- **密码**：粘贴您刚才复制的 token（不是 GitHub 账户密码）

### 方法 2：在 URL 中使用 Token

```powershell
# 替换 YOUR_TOKEN 为您的实际 token
$token = "YOUR_TOKEN"
git remote set-url origin https://GHVBUGB:$token@github.com/GHVBUGB/S9-2.0.git
git push -u origin main
```

### 方法 3：使用 Git Credential Manager（推荐）

Windows 系统通常已安装 Git Credential Manager，它会自动保存您的凭据：

1. 首次推送时输入用户名和 token
2. 系统会保存凭据
3. 之后推送会自动使用保存的凭据

## 安全提示

⚠️ **重要安全注意事项**：

1. **不要将 token 提交到代码仓库**
   - Token 应该保存在本地
   - 如果意外提交，立即撤销并生成新 token

2. **不要分享 token**
   - Token 就像密码一样，不要分享给他人

3. **定期轮换 token**
   - 建议每 90 天更换一次 token

4. **使用最小权限原则**
   - 只授予必要的权限

5. **如果 token 泄露**
   - 立即删除泄露的 token
   - 生成新的 token
   - 检查仓库活动日志

## 快速链接

- **创建 Token**：https://github.com/settings/tokens
- **管理 Token**：https://github.com/settings/tokens
- **查看仓库**：https://github.com/GHVBUGB/S9-2.0

## 故障排除

### 问题：提示 "Authentication failed"
- 检查 token 是否正确复制（没有多余空格）
- 确认 token 未过期
- 确认用户名正确（GHVBUGB）

### 问题：提示 "Permission denied"
- 检查 token 是否有 `repo` 权限
- 确认仓库名称和路径正确

### 问题：Token 在哪里查看？
- Token 创建后只能查看一次
- 如果忘记，需要删除旧 token 并创建新的

## 使用项目脚本

创建 token 后，您可以修改项目中的 `push_final.ps1` 脚本，将 token 添加到脚本中：

```powershell
$token = "您的token在这里"
$remoteUrl = "https://GHVBUGB:$token@github.com/GHVBUGB/S9-2.0.git"
git push $remoteUrl main
```

⚠️ 注意：如果使用此方法，请确保不要将包含 token 的脚本提交到公共仓库！

