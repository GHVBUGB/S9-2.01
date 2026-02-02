单词2.0内容生产标准与题型定义白皮书
范针
王睿
昨天修改
AI速览试用
本文讨论了《单词2.0内容生产标准与题型定义白皮书》,适用月对象为学科产品团队和Prompt工程师,核心目标是确保题目...
适用对象:学科产品团队、Prompt工程师
核心目标:确保每一道题(无论是人工编写还是AI生成)都符合V2.0日的"深层加工"理念,并清晰界定每个环节给
学生提供了什么维度的脚手架。
第一部分:原子题型矩阵(L1-L4)--静态资源标准
1.1 L1语境探针(Context Probe)
定义:利用"核心语块(Chunk)"作为脚手架,在视听双模态下,测试学生对单词在特定搭配中的感知。
核心逻辑:音+形+语境->义(Sound-Form-Contextto Meaaning)
维度
设计详单
义(Meaning).
考察的是:
考察维度
"在有提示的情况下,你能不能调动潜意识猜出它的意思?"
提供脚手架
2.视听脚手架:同步播放音频,防止学生因为"不会读"而干扰对"意思"的判断。
[界面显示]
1.语境脚手架:提供语块(Chunk),而非孤立单词,锁定词义范围。
Card: adapt to changes
(只展示语块,无中文
[后台动作]
自动播放音频:"adapt to changes"
[提问交互]
完整题目演示
老师问:"结合这个搭配(适应变化),你觉得adapt是什么意思?A
[学生操作]
选项(二选一):
适应
放弃
必须是高频语块(Collocation)。
Input: adapt to changes
出题/Prompt标准
Question:看到这个搭配,你觉得adapt是什么意思?
Input:adapt quickly(太泛,无法推导是适应还是改变)
禁忌(Bad Case)
Input:Iwanttoadapt.(这是句子,且信息量为零)
无声音:(禁止静音,必须给听觉刺激)
1.2 L1.5认读跟读(Sight&SoundInput)
定义:教学缓冲层。在L1语境探针(猜义)之后、L2正式测试之前,提供无压力的视听同步输入与口语模仿机
会,建立"眼-耳-口"的肌肉映射。
核心逻辑:视听输入->口语模仿(InputtoOutput)。
维度
设计详单
模仿(Imitation)&参与度(Participation)。
考察维度
考察点:"在正式做题前,你能不能跟着标准音大声读一遍?
(注:此环节不设严苛的通过门槛,主要目的是治"哑巴英语",激活运动皮层。)
1.视觉脚手架:同时展示"英文单词/语块"+"中文释义"(明牌显示,降低认知负荷)
2.听觉脚手架:自动播放标准原声(IPA)。
提供脚手架
3.评分脚手架:提供实时语音波形反馈与正向激励(Good/Excellent)。
[界面显示]
Card: adapt
Text:v.适应
谷鸿基3282
(大字号展示,无挖空)
[后台动作]
1.自动播放音频:/a'daept/
2.麦克风权限自动激活。
完整题目演示
[提问交互]
系统/Jarvis提示:"Follow me!张嘴跟读一遍!
[学生操作]
动作:按住麦克风跟读"Adapt"
反馈:语音引擎打分->弹出绿色波形特效+"Excellent!"。
生产/Prompt
标准
Audio Source:必须与后续L2/L4使用的音频源完全一致(同源),确保听觉印记统一
Display Mode:支持"单词模式"或"语块模式"(根据教学阶段配置,Phase 1通常为单词跟读,Phase4复习可为语块跟读),
XSilentMode:麦克风未开启或无收音反馈(没有交互感,变成了纯听)"
XToo Long:让学生跟读超过5秒的长难句(认知负荷过重,变成了口语考试)
禁忌(Bad
Case
XStrict Fail:仅仅因为发音不完美就判定"失败/重读"(会打击自信,此不节应以鼓励为主)。1.3L2听音辨形(Sound-to-Form)
定义:测试音素感知能力,建立"听觉索引"。
核心逻辑:音->形(SoundtoForm)。
维度
设计详单
形(Form)。
考察维度
考察点:"在一堆长得很像的词里,你能听出哪个是adapt吗?"
提供脚手架
辨析脚手架:提供形近/音近干扰项,强迫学生关注元音/辅音的细微差别。
[界面显示]
(屏幕中央只有一个摇放按钮,无单词显示)
[后台动作]
谷鸿基3282
自动播放音频:/adaept/
[提问交互]
完整题目演示
老师问:"请选择你听到的单词。
[学生操作]
选项(三选一)
adopt(X元音混淆)
adapt
adept (
<元音混淆
Target:目标词(adapt)。
生产/Prompt标准
Distractors:必须是Minimal Pairs(最小对立体),如只变一个元音(adopt)至或辅音
Distractor:apple(完全不相关的词,太容易排除,无效训练)。
禁忌(Bad Case)
1.4 L2闪视辨析(Form-to-Meaning)
定义:测试视觉识别速度,建立"形义直连",拒绝大脑慢速翻译。
核心逻辑:形->义(FormtoMeaning)。
维度
设计详单
义(Meaning).
考察维度
考察点:"单词一闪而过,你能本能地反应出它的意思吗?
提供脚手架
辨析脚手架:提供意义近似干扰项,强迫学生关注中文的细微差别1.
[界面显示]
(倒计时3,2,1)->adapt(闪现0.5秒后消失)
[后台动作]
计时器:严格控制展示时长。
[提问交互]
完整题目演示
老师问:"刚才闪过的是什么意思?"
[学生操作]
选项(三选一)
采用(xadopt的意思)
适应
调节(Xadjust的意思)
生产/Prompt标准
Definition:必须是该词在当前语块下的精确释义。
Distractors:词性相同、词义范畴相近的词。
Target:adapt(意为适应)
禁忌(Bad Case)
Distractor:香蕉(词性不同,跨度太大)。1.5 L3幽灵拼写(Ghost Spelling)
定义:支架式拼写,测试对单词骨架的掌握,是全拼写的前置训练。
核心逻辑:形(残缺)+义->形(完整)(FormReconstruction)。
维度
设计详单
形(Form)。
考察维度
考察点:"给你头尾或骨架,你能把中间的肉补齐吗?"
1.结构脚手架:提供单词长度(下划线数量)和部分字母。
2.语义脚手架:同时提供中文释义。
[界面显示]
adapt(v.适应)
a__pt
提供脚手架
[后台动作]
键盘激活:只允许输入字母。
完整题目演示
[提问交互]
老师问:"补全单词。
[学生操作]
输入:依次输入d,a。
√反馈:输入正确后,下划线填满变成绿色。
Masking:挖掉元音、易错辅音组合或不发音字母。
Ratio:挖空比例30%-50%。
生产/Prompt标准
(这是L4,不是L3)。
禁忌(Bad Case)
xadap_(只挖最后一个,无效训练)。
1.6L4全拼写(Full Production)--语块版
定义:阶段验收标准。在完全撤去视觉提示(无幽灵轮廓、无首尾字母)的情况下,测试学生在L1原语块中,精
准调取并拼写出目标单词的能力。
核心逻辑:阶段考核验收。原语块回环+音义索形(OriginalChunk Retrieval)。不进行语境迁移,严格使用
Phase1阶段建立的"语义锚点"进行唤醒。确保考的是"记忆深度",而不是"阅读逻辑"。维度
设计详单
形(Form)&产出(Production)。
考察维度
考察点:"回到我们最初认识它的那个短语里,你能不能凭声音把它完整写出来?
1.语境脚手架(熟悉):必须使用L1语境探针阶段出现的完全一致的语块(Chunk)。拒绝生词干扰,拒绝长句干扰。
2.听觉脚手架:播放该语块的完整音频。
提供脚手架
3.负向约束:严禁提供首尾字母、单词长度提示。必须是纯盲打。
[界面显示]
Card: [] to changes
Meaning:适应变化
(输入框为空白,无字母提示)
[后台动作]
自动播放音频:"adapttochanges"
[提问交互]
完整题目演示
系统提示:"请听音,补全该短语。
[学生操作]
键盘输入:a-d-a-p-t
回车确认。
Target Word: adapt
L1 Chunk: adapt to changes
L4 Question:[] to changes
Audio: "adapt to changes"
内容范例
Acceptance:完全匹配"adapt"。
Role: Content QA / Strict Validator.
Rule:1.一致性校验:必须检索L1阶段生成的chunk_text,严禁AI临场发挥造新句
2.长度控制:语块长度控制在3-5个单词,保证核心词突出。
AI生产规则
3.唯一性:确保挖空后的剩余部分有足够的辨识度(配合中文意思)
1.7L5全拼写(Full Production)--短句版
定义:终极交付标准。在新语境(短句),测试学生调动"义->形"全链路资源,完成目标单词迁移运用,精准产出
目标词的能力。
核心逻辑:综合验收。能在新语境拼对,不仅说明听得见(内声)、看得懂(语义)、写得出(字形),也说明已
经充分内化,可以达到初步应用水平。维度
设计详单
综合效度(Validity):
1.义(Ticket):100%读懂语境,锁定词义。
2.形(Delivery):盲打输出,验证拼写精度。
考察维度
3.音(Loop):(新增)回环验证。拼对后立刻校准听觉,防止"哑巴英语"或"错误默读"
零脚手架(ZeroScaffolding)
提供脚手架
做题时撤去所有提示。仅在做对后提供"声音脚手架"进行强化。
[Phase 1:挑战]
[界面]It takes time to [
[操作]学生盲打a-d-a-p-t。
[Phase 2:回环
] to a new school.
完整题目演示
反馈:拼写正确,文字变绿。
自动播放:系统立刻播放标准音/adæpt/。
跟读指令
图标闪烁,提示"Follow me!跟读一遍!"(调用语音评分)。
Context:必须是排他性语境
生产/Prompt标
准
Audio Trigger:设置为Post-SuccessAuto-play(成功后自动播放),确保"音-形"在最后一刻严丝合缝,
XPre-play:严禁在填空前播放声音(那就变成听写题了,降低了难度)。
Mute:严禁做完后静默结束(浪费了最佳的矫正发音时机)
禁忌(Bad Case)
第二部分:AI语境加油包--动态生成标准
2.1剧情式微阅读(StoryMode)
谷鸿基3282
定义:基于学生当日新学的黄灯词(Yellow Words),实时生成的"屋本式"短文。
核心逻辑:智能分簇+爽文埋点。阅读为主,查词为辅,旨在通过语:境激活记忆(Activation)。第二部分:AI语境加油包--动态生成标准
2.1剧情式微阅读(Story Mode)
定义:基于学生当日新学的黄灯词(Yellow Words),实时生成的"剧本去"短文
核心逻辑:智能分簇+爽文埋点。阅读为主,查词为辅,旨在通过语境激活记忆(Activation)。
维度
设计详单
场景与频次
[Time]课后复习(Day 1)。
[Trigger]当日新学单词数≥8个时触发。
智能分簇(Clustering)
数据策略
若今日新词>15个,严禁塞入一篇文章。系统需执行K-Means语义聚类,生成2-3篇短文。
例:25词->[GroupA:校园生活](12词)+[GroupB:自然探索](13词)。
1.兴趣脚手架:Topic必须匹配学生画像(如Soccer/Magic)。
2.视觉脚手架:目标词必须加粗(Bold)。
提供脚手架
3.查词脚手架:支持点击单词唤起"轻量级释义浮窗"。
Group A:校园生活(School Life)
(Target: adapt, school, friend, rule, strict, uniform...)
Story: "Tom felt nervous. The rules in his new school were very strict. He had to wear a blue uniform. It was hard to adaapt at first
But after he passed the exam, he made a new friend, Jerry."
[Check Q]: Who is Tom's new friend?
A.Jerry(Correct) B. B. Bob
内容范例
Group B:自然探索(Nature Exploration)
(Target: environment, survive, weather, damage, protect...)
Story: "The weather suddenly changed. It is hard for small plants to survia bad environment. We saw some damage.
We must protect the animals from danger.
[Check Q]: Is it hard for plants to survive there?
A.Yes(Correct)B.No
1.阅读(Read):通读全文。系统不强制要求点击每个词。
2.查词(Click):(可选)点击不懂的高亮词$\rightarrow$弹出释义。
学生交互SOP
3.结算(Finish):点击[我读完了] $\rightarrow$弹出验证题(CheckQ)。
4.验证(Verify):答对$\rightarrows烟花特效$\rightarrows批量标记"详语境已激活"
答错提示"再读一遍",防止瞎点)Role: K12 Graded Reader Writer (CEFR A2).
Inputs: Target Words List (from Cluster), Student Interest.
Constraints:
Prompt标准
1. Bold all target words.
2. Simple sentences (Max 2 clauses).
3. Generate 1 simple comprehension question (Fact-check style).
验证过难:出复杂的推断题(如Whatisthethemeofthisstory?)
点读机模式:强制要求学生必须点完所有词才能结算。
篇幅失控:单篇超过120词。
这会打击阅读积极性。
禁忌(Bad
Case)
2.2仿真完形填空(Cloze Test)--AI真题演练
定义:基于学生本周所有黄灯词,模拟中考/高考完形填空逻辑生成的实战考题
核心逻辑:诊断性抽样。即使学生本周学了50个词,我们也不全考,而而是通过算法抓取"最需要医生看一眼"的几
个词,生成唯一的一篇高质量考题。
维度
设计详单
[Time]周测(Day7)。
场景与频次
[Trigger]累积黄灯词>15个时触发。
[Max Limit]每周上限1篇。
题量控制
禁止生成多篇。我们不追求覆盖率,追求的是"压力测试"的代表性。
(SLA逻辑:如果最难的词都能在语篇里做对,简单的词大概率没问题。)
掐尖采样:
候选池:本周所有黄灯词。
优先级排序:
数据策略
Rank 1:普触发过红灯/熔断的词(RiskyWords)。
Rank2:复习时耗时最长的词(HesitationWords)。
3.入选:截取Top5最不稳的词作为本周考点(挖空)
篇幅:100-120词。
数据密度
挖空:3-5个空(Focus on the Top 3-5 weak words).
1.考题脚手架:标准4选1格式。
2.逻辑脚手架:必须提供"强线索"。
提供脚手架
Passage (110 words):
"Chameleons are amazing animals found in nature. They are famous because they can change their skin color. However, they do not
change color just to look pretty. They do it to match their [1]. For exampeon is sitting on a green leaf, it tu
This helps them hide from [2] like snakes or birds. Besides, chameleons alor to show their feelings. When they 
angry, they might turn red. It is a special way to [3 ] with other chameles without making a sound."
[选项区]
内容范例
1.A.waterB.environment
C.sky D.adoption
2.A.friendsB.plantsC.enemies(
D.toys
3.A.fight B. communicate
C.adapt D.fly
[解析区]Q1 Analysis: The clue is "sitting on a green leaf, it turns green". This tIks about the surroundings, so 'environment'is the correct
answer
1+1+2策略:
Correct:目标词。
干扰项逻辑
Strong:形近/意近干扰。
3.Weak:无关干扰。
Role: Senior Exam Designer.
Inputs: Target Words List (e.g., environment, enemy, communicate).
Task: Create a Cloze Test paragraph (100-120 words).
Constraints:
Prompt标准
1. Create 3 to 5 blanks ([ 1], [2]...).
2. Spacing: Keep at least 15 words between blanks.
3. Context Clue:Ensure the sentence before or after each blank provides the logic to solve it.
4. No Self-Spoilers:Do not repeat the answer wordd in the text
过密挖空:一句话里挖2个空,导致线素断裂(如They[1]tothe[21)。
禁忌(Bad Case)
篇幅过短:少于80词,变成了"单句填空集合",失去语篇阅读卖价值
首句挖空:第一句通常是主旨句(Topic Sentence),严禁挖空,必须给学生建立背景认知