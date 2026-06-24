const { Client, GatewayIntentBits, Partials, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, ChannelType, ActivityType, AttachmentBuilder, PermissionsBitField } = require('discord.js');
const fs = require('fs');

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMembers],
    partials: [Partials.Channel, Partials.Message]
});

const CONFIG = {
    adminRole: "1519051140833218751",
    logChannel: "1518876917527482398",
    categoryID: "1518850112078483577", 
    thumb: './IMG_7025.jpeg',
    mainImg: './IMG_5240.jpeg'
};

let db = { staffPoints: {} };
if (fs.existsSync('./tickets_data.json')) db = JSON.parse(fs.readFileSync('./tickets_data.json'));
function saveDb() { fs.writeFileSync('./tickets_data.json', JSON.stringify(db, null, 2)); }

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
    client.user.setActivity('RAWAF SA BOT', { type: ActivityType.Streaming, url: 'https://www.twitch.tv/rawaf' });
});

client.on('interactionCreate', async interaction => {
    // 1. فتح التكت
    if (interaction.isButton() && ['t_support', 't_complaint', 't_role', 't_creator'].includes(interaction.customId)) {
        const modal = new ModalBuilder().setCustomId('modal_ticket_data').setTitle('بيانات التذكرة');
        modal.addComponents(
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('t_reason').setLabel('سبب فتح التذكرة').setStyle(TextInputStyle.Short).setRequired(true)),
            new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('t_desc').setLabel('شرح التفاصيل').setStyle(TextInputStyle.Paragraph).setRequired(true))
        );
        return await interaction.showModal(modal);
    }

    // 2. معالجة فتح التكت + رسالة الخاص
    if (interaction.isModalSubmit() && interaction.customId === 'modal_ticket_data') {
        await interaction.deferReply({ ephemeral: true });
        const reason = interaction.fields.getTextInputValue('t_reason');
        const desc = interaction.fields.getTextInputValue('t_desc');

        const channel = await interaction.guild.channels.create({
            name: `ticket-${interaction.user.username}`,
            type: ChannelType.GuildText,
            parent: CONFIG.categoryID,
            permissionOverwrites: [
                { id: interaction.guild.id, deny: [PermissionsBitField.Flags.ViewChannel] },
                { id: interaction.user.id, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] },
                { id: CONFIG.adminRole, allow: [PermissionsBitField.Flags.ViewChannel, PermissionsBitField.Flags.SendMessages] }
            ]
        });

        const embedInChannel = new EmbedBuilder()
            .setTitle("تذكرة جديدة")
            .setDescription(`**صاحب التذكرة:** ${interaction.user}\n**السبب:** ${reason}\n**الشرح:** ${desc}`)
            .setColor(4915330);

        await channel.send({ content: `<@&${CONFIG.adminRole}>، ${interaction.user} فتح تذكرة جديدة.`, embeds: [embedInChannel] });
        await channel.send({ components: [new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_claim').setLabel('استلام التكت').setStyle(ButtonStyle.Success))] });

        const embedDM = new EmbedBuilder()
            .setTitle("تم فتح تذكرتك")
            .setDescription(`مرحباً ${interaction.user}، تم فتح تذكرتك بنجاح.\nيرجى التوجه إلى الروم: ${channel}`)
            .setThumbnail("attachment://IMG_7025.jpeg")
            .setImage("attachment://IMG_5240.jpeg")
            .setColor(4915330);
        
        interaction.user.send({ embeds: [embedDM], files: [CONFIG.thumb, CONFIG.mainImg] }).catch(() => {});
        await interaction.editReply({ content: `✅ تم إنشاء تذكرتك في: ${channel}` });
    }

    // 3. معالجة الأزرار (استلام، غلق، وأزرار الخريطة)
    if (interaction.isButton()) {
        const id = interaction.customId;

        // معالجة أزرار الخريطة
        if (id === 'map_roles') return await interaction.reply({ content: '**رتب التفاعل**

<@&1519046388430803065> 

**اللفل المطلوب : 5**

**استمتع بالسيرفر**

<@&1519046968469491752> 

**اللفل المطلوب : 10**

**الخواص: استخدام ايموجيز من خارج السيرفر واضافة رياكشنز**

<@&1519047263626727647> 

**اللفل المطلوب : 15**

**الخواص: تغيير اسمك بالسيرفر**

<@&1519047654116425758> 

**اللفل المطلوب : 25**

**الخواص: اختيار لونك الخاص <#1518870053192466503> **

<@&1519047973965795540> 

**اللفل المطلوب :35**

**الخواص : ارسال صور وفيديوهات بالشات العام**

<@&1519048167188861018> 

**اللفل المطلوب :60**

**الخواص : جميع ماسبق**

<@&1519048390187548722> 

**اللفل المطلوب : 80**

**الخواص : رتبه خاصه**', ephemeral: true });
        if (id === 'map_premium') return await interaction.reply({ content: '// > **الرتب المميزه**



<@&1519048728755830785>  يوتيوبر 

**قناتك لازم تكون فيها فوق الالف**

<@&1519048847559622769> تيكتوكر 

**حسابك لازم يكون فيه 10k+**

 <@&1519049800287518780> 

**فانزات رواف الي عندهم 1k+ **

 <@&1519049858047152279> 

**فانزات رواف الي عندهم 10k+**

<@&1519049752157749418> كخاوي

**الي عنده لبس "كخه" **

<@&1519049595244515418> رسام

**الي عندهم حس فني**', ephemeral: true });
        if (id === 'map_rooms') return await interaction.reply({ content: '**اهلاً وسهلا بك في دليل السيرفر ، هنا سيتم شرح أبزر الاشياء الموجوده داخل السيرفر:**



// > **رومات السيرفر :**



**الرومات العامه :**

<#1518860063496867871>  

### ترحيب لك عند دخولك

-

<#1518860483392704533> 

### هنا يظهر تقدمك بالسيرفر وكم اجتزت لفل

-

<#1518860676494397620> 

### بوستات السيرفر 



// > **شاتات السيرفر :**



<#1518851646174662707> لمتابعة أحدث وأخر اخبار السيرفر

-

<#1518852029089579059> لإختيار الرتب واهتمامك بالسيرفر

-

<#1518850225991848016> لفتح تذكرة دعم للإدارة والأقسام 

-

<#1518847251731185825> الشات العام للتحدث مع الأعضاء دون مخالفة القوانين

-

<#1518854040660869301> لمشاركة فنكم وابداعاتكم بالرسم

-

<#1518855027731599477> 

اقتراحاتكم لفيديوهات رواف الجايه

-

<#1518870053192466503> تغير لونك بالسيرفر



// > **أقسام السيرفر :**



**قسم الفعاليات :**

<#1518853454443839619> شات الفعاليات عند اقامة فعاليه سيتم فتح الشات ويمكنك المشاركه 

<#1518853717825425579>  الفايزين مع رواف يقدرون يكتبون بالروم هذا



**قسم الالعاب :**

<#1518852185142591518> 



**قسم التصاميم :**

<#1518859276683182142> تصاميمكم لرواف

<#1518856037707546657> رسماتكم لرواف



**قسم الفانزات :**

<#1518871220706082867>  شات فانزات رواف الالماسيين

-

<#1518849706631893032> شات الكخاويين

-

<#1518849203722391754> يوزراتكم بروبلوكس



**قسم التريدات :**

<#1518857546822320131>  قوانين التريدات

<#1518858420097126462> تريدات ام ام تو

<#1518857897289842720> تريدات ادوبت مي

<#1518858567896010913> بلوكس فروت 

<#1518858829759250433> بيت سلمنيتر', ephemeral: true });

        // معالجة أزرار التكت
        if (id === 'btn_claim') {
            db.staffPoints[interaction.user.id] = (db.staffPoints[interaction.user.id] || 0) + 1;
            saveDb();
            await interaction.reply({ content: `✅ **تم استلام التكت بواسطة: ${interaction.user}**` });
            const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('btn_close').setLabel('غلق التكت').setStyle(ButtonStyle.Danger));
            await interaction.message.edit({ components: [row] });
        }
        if (id === 'btn_close') {
            const modal = new ModalBuilder().setCustomId('modal_close').setTitle('سبب الغلق');
            modal.addComponents(new ActionRowBuilder().addComponents(new TextInputBuilder().setCustomId('c_reason').setLabel('اكتب سبب الغلق').setStyle(TextInputStyle.Paragraph).setRequired(true)));
            return await interaction.showModal(modal);
        }
    }

    // 4. أرشفة التكت + رسالة الإغلاق بالخاص
    if (interaction.isModalSubmit() && interaction.customId === 'modal_close') {
        const reason = interaction.fields.getTextInputValue('c_reason');
        const logChannel = interaction.guild.channels.cache.get(CONFIG.logChannel);
        
        if (logChannel) {
            const logEmbed = new EmbedBuilder().setTitle("أرشفة تذكرة").setColor(4915330)
                .addFields({ name: "رقم التذكرة", value: interaction.channel.id, inline: true }, { name: "صاحب التذكرة", value: interaction.channel.name.replace('ticket-', ''), inline: true }, { name: "سبب الغلق", value: reason, inline: false });
            logChannel.send({ embeds: [logEmbed] });
        }
        
        const member = interaction.channel.members.find(m => !m.user.bot && m.id !== interaction.user.id);
        if (member) {
            const closeEmbed = new EmbedBuilder()
                .setTitle("تم إغلاق تذكرتك")
                .setDescription(`تم إغلاق التذكرة بواسطة الإداري: ${interaction.user}\n**السبب:** ${reason}`)
                .setThumbnail("attachment://IMG_7025.jpeg")
                .setImage("attachment://IMG_5240.jpeg")
                .setColor(4915330);
            member.send({ embeds: [closeEmbed], files: [CONFIG.thumb, CONFIG.mainImg] }).catch(() => {});
        }
        
        await interaction.reply('جاري غلق التكت...');
        setTimeout(() => interaction.channel.delete(), 2000);
    }
});

client.on('messageCreate', async message => {
    if (!message.content.startsWith('!')) return;
    const args = message.content.slice(1).split(/ +/);
    const cmd = args.shift().toLowerCase();
    
    if (cmd === 'تكت') {
        const row1 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('t_support').setLabel('تواصل مع الإدارة').setStyle(ButtonStyle.Primary), new ButtonBuilder().setCustomId('t_complaint').setLabel('شكوى').setStyle(ButtonStyle.Primary));
        const row2 = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('t_role').setLabel('طلب رتبة').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('t_creator').setLabel('صناع المحتوى').setStyle(ButtonStyle.Secondary));
        await message.channel.send({ embeds: [new EmbedBuilder().setTitle("مرحبا بك في قسم الدعم الفني").setDescription("اذا كنت تواجه مشكلة,تحتاج الى مساعده,او ترغب بتقديم بلاغ, يمكنك فتح تذكره وسيتولى فريقنا مساعدتك.").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], files: [CONFIG.thumb, CONFIG.mainImg], components: [row1, row2] });
    }
    if (cmd === 'خريطة') {
        const row = new ActionRowBuilder().addComponents(new ButtonBuilder().setCustomId('map_roles').setLabel('شرح رتب').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('map_premium').setLabel('رتب مميزة').setStyle(ButtonStyle.Secondary), new ButtonBuilder().setCustomId('map_rooms').setLabel('شرح رومات').setStyle(ButtonStyle.Secondary));
        await message.channel.send({ embeds: [new EmbedBuilder().setTitle("مرحبا بك, هنا تجد دليلك لجميع رتب ورولات سيرفر رواف").setThumbnail("attachment://IMG_7025.jpeg").setImage("attachment://IMG_5240.jpeg")], files: [CONFIG.thumb, CONFIG.mainImg], components: [row] });
    }
    // ... باقي الأوامر (تكتات، طرد، قفل، فتح)
    if (cmd === 'تكتات') { const member = message.mentions.members.first(); if (member) message.reply(`الإداري ${member.displayName} استلم **${db.staffPoints[member.id] || 0}** تكت.`); }
    if (!message.member.roles.cache.has(CONFIG.adminRole)) return;
    if (cmd === 'طرد') { const m = message.mentions.members.first(); if (m) m.kick(); }
    if (cmd === 'قفل') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: false }); }
    if (cmd === 'فتح') { message.channel.permissionOverwrites.edit(message.guild.id, { SendMessages: true }); }
});

client.login(process.env.TOKEN);
