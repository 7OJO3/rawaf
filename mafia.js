const { client } = require('./index4.js');
const { ActionRowBuilder, ButtonBuilder, ButtonStyle, EmbedBuilder } = require('discord.js');

let lobby = [];
let gameStarted = false;

// دالة توزيع الأدوار
async function startMafia(interaction) {
    if (lobby.length < 4) return interaction.reply({ content: "⚠️ يجب أن يكون هناك 4 لاعبين على الأقل للبدء!", ephemeral: true });
    
    gameStarted = true;
    let roles = ['مافيا', 'طبيب', 'شايب', 'فخ', 'مواطن', 'مواطن']; 
    
    // خلط الأدوار عشوائياً
    roles = roles.sort(() => Math.random() - 0.5);

    interaction.reply("🎮 **بدأت اللعبة! تم إرسال الأدوار في الخاص للجميع.**");

    lobby.forEach(async (member, index) => {
        let role = roles[index % roles.length];
        try {
            await member.send(`🎭 **دورك في المافيا:** **${role}**\n\n**مهمتك:** ${
                role === 'مافيا' ? 'اغتيال الأعضاء!' : 
                role === 'طبيب' ? 'حماية شخص واحد في كل ليلة.' : 
                role === 'شايب' ? 'كشف دور واحد من الأعضاء.' : 
                role === 'فخ' ? 'تضليل الجميع ومنع القتل.' : 
                'البقاء على قيد الحياة واكتشاف المافيا.'
            }`);
        } catch (e) {
            interaction.channel.send(`⚠️ ${member.user.username}، لم أستطع إرسال رسالة لك، يرجى فتح الخاص!`);
        }
    });
}

// الاستماع للأزرار
client.on('interactionCreate', async interaction => {
    if (!interaction.isButton()) return;

    if (interaction.customId === 'join_mafia') {
        if (gameStarted) return interaction.reply({ content: "❌ اللعبة بدأت بالفعل!", ephemeral: true });
        if (!lobby.includes(interaction.member)) {
            lobby.push(interaction.member);
            interaction.reply({ content: "✅ تم انضمامك للعبة المافيا!", ephemeral: true });
        } else {
            interaction.reply({ content: "⚠️ أنت منضم بالفعل!", ephemeral: true });
        }
    }

    if (interaction.customId === 'leave_mafia') {
        lobby = lobby.filter(m => m.id !== interaction.member.id);
        interaction.reply({ content: "🚶‍♂️ تم خروجك من اللعبة.", ephemeral: true });
    }

    if (interaction.customId === 'start_mafia_btn') {
        // التحقق من صلاحية الإدارة للبدء
        if (!interaction.member.permissions.has('Administrator')) 
            return interaction.reply({ content: "❌ فقط الإدارة يمكنها بدء اللعبة!", ephemeral: true });
        
        startMafia(interaction);
    }
});
